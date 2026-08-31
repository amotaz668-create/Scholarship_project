const applicationService = require("../services/application");

const { createLog } = require("../services/adminLog.service");

// ==========================================
// 1. إنشاء طلب تقديم جديد
// ==========================================

const createApplication = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { scholarshipId, documents, answers } = req.body;

    const newApp = await applicationService.createApplication(
      studentId,
      scholarshipId,
      {
        documents,
        answers,
      },
    );

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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
      userId,
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 3. جلب طلبات الطالب الحالي
// ==========================================

const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications =
      await applicationService.getStudentApplications(studentId);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 4. جلب تفاصيل طلب واحد
// ==========================================

const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application =
      await applicationService.getApplicationById(applicationId);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 5. جلب طلبات موظف معين
// ==========================================

const getAssignedApplications = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const applications =
      await applicationService.getAssignedApplications(employeeId);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
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

    const updatedApp = await applicationService.updateApplication(
      applicationId,
      studentId,
      updateData,
    );

    res.status(200).json({
      success: true,
      data: updatedApp,
      message: "Application updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Submit Application
// ==========================================

const submitApplication = async (req, res) => {
  try {
    const app = await applicationService.submitApplication(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: app,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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
};
