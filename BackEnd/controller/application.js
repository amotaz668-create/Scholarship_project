const applicationService = require("../services/application");

const { createLog } = require("../services/adminLog.service");

const sendError = (res, error, fallbackStatus = 400) => {
  const isDatabaseValidationError = error?.name === "ValidationError" || error?.name === "CastError";
  const status = isDatabaseValidationError ? 400 : (error.statusCode || fallbackStatus);
  const message = isDatabaseValidationError
    ? "Could not save the application. Please review the selected documents and try again."
    : error.message;
  return res
    .status(status)
    .json({ success: false, message, ...(error.details ? { missing: error.details } : {}) });
};

// ==========================================
// 1. إنشاء طلب تقديم جديد
// ==========================================

const createApplication = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { scholarshipId, documents, answers, selectedDegree } = req.body;

    const result = await applicationService.createApplication(
      studentId,
      scholarshipId,
      {
        documents,
        answers,
        selectedDegree
      },
    );

    res.status(201).json({
      success: true,
      message: result.reused ? "Existing draft application loaded" : "Application created successfully",
      data: result.application,
      reused: result.reused,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// 2. تحديث حالة الطلب
// ==========================================

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const { status, note } = req.body;

    const userId = req.user._id;

    const updatedApp = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      req.user,
      note,
    );

    // ==========================================
    // Admin Log
    // ==========================================

    if (
      req.user.role === "admin" &&
      ["accepted", "rejected"].includes(status)
    ) {
      await createLog(
        req.user._id,

        status === "accepted" ? "APPROVE_APPLICATION" : "REJECT_APPLICATION",

        "APPLICATION",

        updatedApp._id,

        `Admin changed application status to ${status}`,
      );
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApp,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// 3. جلب طلبات الطالب الحالي
// ==========================================

const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications =
      await applicationService.getStudentApplications(req.user);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// 4. جلب تفاصيل طلب واحد
// ==========================================

const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application =
      await applicationService.getApplicationById(applicationId, req.user);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    sendError(res, error, 404);
  }
};

// ==========================================
// 5. جلب طلبات موظف معين
// ==========================================

const getAssignedApplications = async (req, res) => {
  try {
    const applications =
      await applicationService.getAssignedApplications(req.user._id);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// 6. جلب كل الطلبات
// ==========================================

const getAllApplications = async (req, res) => {
  try {
    const applications = await applicationService.getAllApplications();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// تعديل بيانات الطلب
// ==========================================

const updateApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const studentId = req.user.id;

    const updateData = req.body;

    await applicationService.updateApplication(
      applicationId,
      studentId,
      updateData,
    );

    res.status(200).json({
      success: true,
      data: await applicationService.prepareApplication(applicationId, req.user),
      message: "Application updated successfully",
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// سحب الطلب
// ==========================================

const withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const studentId = req.user.id;

    const withdrawnApp = await applicationService.withdrawApplication(
      applicationId,
      studentId,
    );

    res.status(200).json({
      success: true,
      data: withdrawnApp,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    sendError(res, error);
  }
};

// ==========================================
// Submit Application
// ==========================================

const submitApplication = async (req, res) => {
  try {
    const app = await applicationService.submitApplication(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: app,
      message: "Application submitted successfully",
    });
  } catch (error) {
    sendError(res, error);
  }
};

const prepareApplication = async (req, res) => {
  try {
    const data = await applicationService.prepareApplication(req.params.id, req.user);
    res.status(200).json({ success: true, data });
  } catch (error) {
    sendError(res, error);
  }
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
  prepareApplication,
};
