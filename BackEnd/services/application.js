const Application = require("../models/application");
const Scholarship = require("../models/scholarship");
const StudentProfile = require("../models/StudentProfile");
const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");
const { APPLICATION_PROFILE_FIELDS } = require("../constants");
const { UPLOAD_DIR } = require("../middlewares/upload.middleware");
const { createNotification } = require("./notification.service");

// Reusable populate configuration.
// This makes the application response include
// university and country names instead of only their ObjectIds.
const scholarshipPopulate = {
  path: "scholarshipId",
  populate: [
    {
      path: "university",
      select: "name",
    },
    {
      path: "country",
      select: "name",
    },
  ],
};

const present = (value) => value !== undefined && value !== null && value !== "";
const plain = (value) => value?.toObject ? value.toObject() : value;

const fail = (message, statusCode = 400, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  throw error;
};

const requirementLabel = (requirement) => ({
  key: requirement.key,
  label: requirement.label,
  labelAr: requirement.labelAr || "",
});

const answerMap = (answers = []) => new Map(
  answers.map((answer) => [answer.requirementKey || answer.question, answer.answer]),
);

const profileValues = (user, profile, overrides = {}) => ({
  name: user?.name,
  email: user?.email,
  ...(plain(profile) || {}),
  ...(plain(overrides) || {}),
});

const requiredDocumentTypes = (scholarship) => {
  const configured = (scholarship.requiredDocuments || [])
    .filter((document) => document.required)
    .map((document) => document.type);

  const dynamic = (scholarship.applicationRequirements || [])
    .filter((requirement) => requirement.required && requirement.type === "document")
    .map((requirement) => requirement.key);

  return [...new Set([...configured, ...dynamic])];
};

const normalizeApplicationDocuments = async (studentId, requestedDocuments = []) => {
  const uniqueIds = [...new Set(
    requestedDocuments
      .map((document) => document?.documentId)
      .filter(Boolean)
      .map(String),
  )];

  if (uniqueIds.length !== requestedDocuments.length) {
    fail("Each application document must have a unique documentId");
  }

  const documents = await Document.find({
    _id: { $in: uniqueIds },
    studentId,
  });

  if (documents.length !== uniqueIds.length) {
    fail("One or more documents are invalid or unauthorized", 403);
  }

  const byId = new Map(
    documents.map((document) => [String(document._id), document]),
  );

  return uniqueIds.map((id) => {
    const document = byId.get(id);

    return {
      documentId: document._id,
      name: document.type,
      type: document.type,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      mimeType: document.mimeType,
    };
  });
};

const evaluateApplication = (application, scholarship, user, profile) => {
  const requirements = scholarship.applicationRequirements || [];
  const answers = answerMap(application.answers);
  const overrides = plain(application.profileData) || {};
  const resolvedProfile = profileValues(user, profile, overrides);
  const selectedTypes = new Set(
    (application.documents || []).map(
      (document) => document.type || document.name,
    ),
  );

  const missing = {
    profileFields: [],
    answers: [],
    documents: [],
  };

  const profileSnapshot = {};

  const resolvedRequirements = requirements.map((requirement) => {
    let value;
    let origin = "missing";

    if (requirement.type === "document") {
      value = selectedTypes.has(requirement.key);

      if (value) {
        origin = "application";
      }
    } else if (requirement.source === "profile") {
      value = resolvedProfile[requirement.profileField];

      if (present(overrides[requirement.profileField])) {
        origin = "application";
      } else if (present(value)) {
        origin = "profile";
      }

      if (present(value)) {
        profileSnapshot[requirement.profileField] = value;
      }

      if (requirement.required && !present(value)) {
        missing.profileFields.push(requirementLabel(requirement));
      }
    } else {
      value = answers.get(requirement.key);

      if (present(value) || value === false) {
        origin = "application";
      }

      if (
        requirement.required &&
        !present(value) &&
        value !== false
      ) {
        missing.answers.push(requirementLabel(requirement));
      }
    }

    return {
      ...plain(requirement),
      value,
      origin,
      missing: requirement.required && origin === "missing",
    };
  });

  for (const type of requiredDocumentTypes(scholarship)) {
    if (!selectedTypes.has(type)) {
      missing.documents.push(type);
    }
  }

  return {
    complete:
      !missing.profileFields.length &&
      !missing.answers.length &&
      !missing.documents.length,

    missing,
    profileSnapshot,
    requirements: resolvedRequirements,
  };
};

const loadOwnedPreparation = async (applicationId, user) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId: user._id,
  }).populate(scholarshipPopulate);

  if (!application) {
    fail("Application not found.", 404);
  }

  const [profile, availableDocuments] = await Promise.all([
    StudentProfile.findOne({ userId: user._id }),
    Document.find({ studentId: user._id }).sort({ uploadedAt: -1 }),
  ]);

  const readiness = evaluateApplication(
    application,
    application.scholarshipId,
    user,
    profile,
  );

  return {
    application,
    scholarship: application.scholarshipId,
    profile,
    availableDocuments,
    readiness,
  };
};

const createApplication = async (
  studentId,
  scholarshipId,
  applicationData = {},
) => {
  const existing = await Application.findOne({
    studentId,
    scholarshipId,
  }).sort({ createdAt: -1 });

  if (existing?.status === "draft") {
    return {
      application: existing,
      reused: true,
    };
  }

  if (existing && existing.status !== "withdrawn") {
    fail(
      "You already have an active application for this scholarship",
      409,
    );
  }

  const scholarship = await Scholarship.findById(scholarshipId);

  if (!scholarship) {
    fail("Scholarship not found", 404);
  }

  const documents = applicationData.documents
    ? await normalizeApplicationDocuments(
      studentId,
      applicationData.documents,
    )
    : [];

  const application = await Application.create({
    studentId,
    scholarshipId,
    scholarshipTitle: scholarship.title,
    documents,
    answers: applicationData.answers || [],
    status: "draft",
  });

  return {
    application,
    reused: false,
  };
};

const updateApplicationStatus = async (
  applicationId,
  newStatus,
  user,
  note = "",
) => {
  const filter = {
    _id: applicationId,
  };

  if (user.role === "employee") {
    filter.assignedEmployeeId = user._id;
  }

  const application = await Application.findOne(filter);

  if (!application) {
    fail("Application not found", 404);
  }

  const allowedTransitions = {
    draft: ["submitted", "withdrawn"],
    submitted: ["under_review", "withdrawn"],
    under_review: ["accepted", "rejected", "missing_documents"],
    missing_documents: ["under_review", "rejected"],
    accepted: [],
    rejected: [],
    withdrawn: [],
  };

  if (application.status === newStatus) {
    fail(`Application is already in ${newStatus} status`);
  }

  if (!allowedTransitions[application.status].includes(newStatus)) {
    fail(
      `Invalid transition: Cannot change status from ${application.status} to ${newStatus}`,
    );
  }

  const oldStatus = application.status;

  application.status = newStatus;

  application.timeline.push({
    oldStatus,
    newStatus,
    changedBy: user._id,
    note,
    date: new Date(),
  });

  if (["accepted", "rejected"].includes(newStatus)) {
    application.reviewedAt = new Date();
    application.reviewedBy = user._id;
  }

  await application.save();

  await createNotification(
    application.studentId,
    "Application Status Updated",
    `Your application status has been changed to ${newStatus}`,
    "APPLICATION_STATUS_CHANGED",
    application._id,
  );

  return application;
};

const getStudentApplications = async (user) => {
  const [applications, profile] = await Promise.all([
    Application.find({
      studentId: user._id,
    })
      .populate(scholarshipPopulate)
      .sort({ createdAt: -1 })
      .lean(),

    StudentProfile.findOne({
      userId: user._id,
    }).lean(),
  ]);

  return applications.map((application) => {
    const scholarship = application.scholarshipId;

    const readiness = scholarship
      ? evaluateApplication(
        application,
        scholarship,
        user,
        profile,
      )
      : {
        complete: false,
        missing: {
          profileFields: [],
          answers: [],
          documents: [],
        },
      };

    return {
      ...application,
      isComplete: readiness.complete,
      missing: readiness.missing,
    };
  });
};

const getApplicationById = async (applicationId, user) => {
  const filter = {
    _id: applicationId,
  };

  if (user.role === "student") {
    filter.studentId = user._id;
  } else if (user.role === "employee") {
    filter.assignedEmployeeId = user._id;
  } else if (user.role !== "admin") {
    fail("Forbidden.", 403);
  }

  const application = await Application.findOne(filter)
    .populate(scholarshipPopulate);

  if (!application) {
    fail("Application not found.", 404);
  }

  return application;
};

const getAssignedApplications = async (employeeId) =>
  Application.find({
    assignedEmployeeId: employeeId,
  })
    .populate(scholarshipPopulate)
    .sort({ updatedAt: -1 });

const getAllApplications = async () =>
  Application.find({})
    .populate(scholarshipPopulate)
    .sort({ createdAt: -1 });

const prepareApplication = async (applicationId, user) => {
  const context = await loadOwnedPreparation(
    applicationId,
    user,
  );

  const readiness = evaluateApplication(
    context.application,
    context.scholarship,
    user,
    context.profile,
  );

  return {
    application: context.application,
    scholarship: context.scholarship,
    profileData: profileValues(
      user,
      context.profile,
      context.application.profileData,
    ),
    requirements: readiness.requirements,
    availableDocuments: context.availableDocuments,
    selectedDocumentIds: context.application.documents.map(
      (document) => String(document.documentId),
    ),
    readiness: {
      complete: readiness.complete,
      missing: readiness.missing,
    },
  };
};

const updateApplication = async (
  applicationId,
  studentId,
  updateData,
) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId,
  }).populate(scholarshipPopulate);

  if (!application) {
    fail("Application not found or unauthorized", 404);
  }

  // Students can edit both new draft applications and
  // applications returned for missing documents.
  const editableStatuses = ["draft", "missing_documents"];

  if (!editableStatuses.includes(application.status)) {
    fail("Only draft or applications with missing documents can be edited");
  }

  const requirements =
    application.scholarshipId.applicationRequirements || [];

  const requirementKeys = new Set(
    requirements.map((requirement) => requirement.key),
  );

  const profileFields = new Set(
    requirements
      .filter((requirement) => requirement.source === "profile")
      .map((requirement) => requirement.profileField),
  );

  if (updateData.answers) {
    application.answers = updateData.answers.map((answer) => {
      if (
        requirementKeys.size &&
        !requirementKeys.has(answer.requirementKey)
      ) {
        fail(
          `Unknown application requirement: ${answer.requirementKey}`,
        );
      }

      return {
        requirementKey: answer.requirementKey,
        question: answer.question,
        answer: answer.answer,
      };
    });
  }

  const safeProfileData = {};

  if (updateData.profileData) {
    for (const [field, value] of Object.entries(
      updateData.profileData,
    )) {
      if (
        !APPLICATION_PROFILE_FIELDS.includes(field) ||
        !profileFields.has(field)
      ) {
        fail(
          `Profile field is not required by this scholarship: ${field}`,
        );
      }

      safeProfileData[field] = value;
    }

    application.profileData = safeProfileData;
  }

  if (updateData.documents || updateData.documentIds) {
    // Keep documentIds as a compatibility input for older clients,
    // while all newly stored and returned values use the object structure above.

    const requestedDocuments =
      updateData.documents ||
      updateData.documentIds.map((documentId) => ({
        documentId,
      }));

    application.documents = await normalizeApplicationDocuments(
      studentId,
      requestedDocuments,
    );
  }

  if (
    updateData.saveProfile &&
    Object.keys(safeProfileData).length
  ) {
    const reusable = Object.fromEntries(
      Object.entries(safeProfileData).filter(
        ([field]) => !["name", "email"].includes(field),
      ),
    );

    if (Object.keys(reusable).length) {
      await StudentProfile.findOneAndUpdate(
        { userId: studentId },
        {
          $set: reusable,
          $setOnInsert: {
            userId: studentId,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );
    }
  }

  await application.save();

  return application;
};

const withdrawApplication = async (
  applicationId,
  studentId,
) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId,
  });

  if (!application) {
    fail("Application not found or unauthorized", 404);
  }

  if (
    ![
      "submitted",
      "under_review",
      "missing_documents",
    ].includes(application.status)
  ) {
    fail(
      `Cannot withdraw application in ${application.status} status`,
    );
  }

  const oldStatus = application.status;

  application.status = "withdrawn";

  application.timeline.push({
    oldStatus,
    newStatus: "withdrawn",
    changedBy: studentId,
    note: "Student withdrew the application",
    date: new Date(),
  });

  await application.save();

  return application;
};

const submitApplication = async (
  applicationId,
  user,
) => {
  const context = await loadOwnedPreparation(
    applicationId,
    user,
  );

  const application = context.application;

  // Students can submit both new draft applications and applications
  // that were returned with missing documents after they fix the issues.
  const submittableStatuses = ["draft", "missing_documents"];

  if (!submittableStatuses.includes(application.status)) {
    fail("Only draft or applications with missing documents can be submitted");
  }

  const readiness = evaluateApplication(
    application,
    context.scholarship,
    user,
    context.profile,
  );

  const selectedIds = application.documents
    .map((document) => document.documentId)
    .filter(Boolean);

  const storedDocuments = await Document.find({
    _id: { $in: selectedIds },
    studentId: user._id,
  });

  const validDocumentTypes = new Set(
    storedDocuments
      .filter((document) => {
        const fileName = path.basename(
          String(document.fileUrl || ""),
        );

        return (
          document.fileUrl === `/uploads/${fileName}` &&
          fs.existsSync(
            path.resolve(UPLOAD_DIR, fileName),
          )
        );
      })
      .map((document) => document.type),
  );

  readiness.missing.documents = requiredDocumentTypes(
    context.scholarship,
  ).filter(
    (type) => !validDocumentTypes.has(type),
  );

  readiness.complete =
    !readiness.missing.profileFields.length &&
    !readiness.missing.answers.length &&
    !readiness.missing.documents.length;

  if (!readiness.complete) {
    fail(
      "Application is incomplete.",
      422,
      readiness.missing,
    );
  }

  application.profileSnapshot =
    readiness.profileSnapshot;

  const previousStatus = application.status;

  application.status = "submitted";
  application.submittedAt = new Date();

  application.timeline.push({
    oldStatus: previousStatus,
    newStatus: "submitted",
    changedBy: user._id,
    note: "Student submitted the completed application",
    date: new Date(),
  });

  await application.save();

  return application;
};

module.exports = {
  createApplication,
  updateApplicationStatus,
  getStudentApplications,
  getApplicationById,
  getAssignedApplications,
  getAllApplications,
  prepareApplication,
  updateApplication,
  withdrawApplication,
  submitApplication,
  evaluateApplication,
};