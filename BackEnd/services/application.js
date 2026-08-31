const Application = require("../models/application");
const Scholarship = require("../models/scholarship");

const { createNotification } = require("./notification.service");

// ==========================================
// Create Application
// ==========================================

const createApplication = async (studentId, scholarshipId, applicationData) => {
  const existingApp = await Application.findOne({
    studentId: studentId,
    scholarshipId: scholarshipId,
    status: { $ne: "withdrawn" },
  });

  if (existingApp) {
    throw new Error(
      "You already have an active application for this scholarship",
    );
  }

  const scholarship = await Scholarship.findById(scholarshipId);

  if (!scholarship) {
    throw new Error("Scholarship not found");
  }

  const newApp = new Application({
    studentId: studentId,
    scholarshipId: scholarshipId,
    scholarshipTitle: scholarship.title,
    documents: applicationData.documents || [],
    answers: applicationData.answers || [],
    status: "draft",
  });

  await newApp.save();

  return newApp;
};

// ==========================================
// Update Application Status
// ==========================================

const updateApplicationStatus = async (
  applicationId,
  newStatus,
  userId,
  note = "",
) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  const currentStatus = application.status;

  if (currentStatus === newStatus) {
    throw new Error(`Application is already in ${newStatus} status`);
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

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid transition: Cannot change status from ${currentStatus} to ${newStatus}`,
    );
  }

  const timelineEntry = {
    oldStatus: currentStatus,
    newStatus: newStatus,
    changedBy: userId,
    note: note,
    date: new Date(),
  };

  application.status = newStatus;

  application.timeline.push(timelineEntry);

  if (newStatus === "submitted") {
    application.submittedAt = new Date();
  } else if (newStatus === "accepted" || newStatus === "rejected") {
    application.reviewedAt = new Date();

    application.reviewedBy = userId;
  }

  await application.save();

  // Notification للطالب
  await createNotification(
    application.studentId,
    "Application Status Updated",
    `Your application status has been changed to ${newStatus}`,
    "APPLICATION_STATUS_CHANGED",
    application._id,
  );

  return application;
};

// ==========================================
// Get Student Applications
// ==========================================

const getStudentApplications = async (studentId) => {
  const applications = await Application.find({
    studentId,
  }).sort({
    createdAt: -1,
  });

  return applications;
};

// ==========================================
// Get Application By ID
// ==========================================

const getApplicationById = async (applicationId) => {
  const application =
    await Application.findById(applicationId).populate("scholarshipId");

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};

// ==========================================
// Get Assigned Applications
// ==========================================

const getAssignedApplications = async (employeeId) => {
  const applications = await Application.find({
    assignedEmployeeId: employeeId,
  });

  return applications;
};

// ==========================================
// Get All Applications
// ==========================================

const getAllApplications = async () => {
  const applications = await Application.find({}).sort({
    createdAt: -1,
  });

  return applications;
};

// ==========================================
// Update Application
// ==========================================

const updateApplication = async (applicationId, studentId, updateData) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId: studentId,
  });

  if (!application) {
    throw new Error("Application not found or unauthorized");
  }

  const allowedStatusesForUpdate = ["draft", "submitted"];

  if (!allowedStatusesForUpdate.includes(application.status)) {
    throw new Error(
      "You cannot update this application after it has entered the review stage",
    );
  }

  if (updateData.documents) {
    application.documents = updateData.documents;
  }

  if (updateData.answers) {
    application.answers = updateData.answers;
  }

  await application.save();

  return application;
};

// ==========================================
// Withdraw Application
// ==========================================

const withdrawApplication = async (applicationId, studentId) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId: studentId,
  });

  if (!application) {
    throw new Error("Application not found or unauthorized");
  }

  const currentStatus = application.status;

  const allowedToWithdraw = ["submitted", "under_review", "missing_documents"];

  if (!allowedToWithdraw.includes(currentStatus)) {
    throw new Error(`Cannot withdraw application in ${currentStatus} status`);
  }

  const timelineEntry = {
    oldStatus: currentStatus,
    newStatus: "withdrawn",
    changedBy: studentId,
    note: "Student withdrawn the application",
    date: new Date(),
  };

  application.status = "withdrawn";

  application.timeline.push(timelineEntry);

  await application.save();

  return application;
};

// ==========================================
// Submit Application
// ==========================================

const submitApplication = async (applicationId, studentId) => {
  const application = await Application.findOne({
    _id: applicationId,
    studentId,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "draft") {
    throw new Error("Only draft applications can be submitted");
  }

  application.status = "submitted";

  application.submittedAt = new Date();

  application.timeline.push({
    oldStatus: "draft",
    newStatus: "submitted",
    changedBy: studentId,
    date: new Date(),
  });

  await application.save();

  return application;
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  createApplication,
  updateApplicationStatus,
  getStudentApplications,
  getApplicationById,
  getAssignedApplications,
  getAllApplications,
  updateApplication,
  withdrawApplication,
  submitApplication,
};
