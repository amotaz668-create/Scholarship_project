const express = require("express");

const router = express.Router();

const applicationController = require("../controller/application");

const {
  validateCreateApplication,
  validateUpdateStatus,
  validateApplicationId,
  validateUpdateApplication,
} = require("../validators/application");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

// ==========================================
// Student Routes
// ==========================================

// Create Application
router.post(
  "/",
  authenticate,
  authorize("student"),
  validateCreateApplication,
  applicationController.createApplication,
);

// Get My Applications
router.get(
  "/my",
  authenticate,
  authorize("student"),
  applicationController.getStudentApplications,
);

// Submit Application
router.patch(
  "/:id/submit",
  authenticate,
  authorize("student"),
  validateApplicationId,
  applicationController.submitApplication,
);

// Withdraw Application
router.patch(
  "/:id/withdraw",
  authenticate,
  authorize("student"),
  validateApplicationId,
  applicationController.withdrawApplication,
);

// Update Application
router.patch(
  "/:id",
  authenticate,
  authorize("student"),
  validateApplicationId,
  validateUpdateApplication,
  applicationController.updateApplication,
);

// ==========================================
// Admin / Employee Routes
// ==========================================

// Get All Applications
// Admin Only
router.get(
  "/",
  authenticate,
  authorize("admin"),
  applicationController.getAllApplications,
);

// Update Application Status
// Employee + Admin
router.patch(
  "/:id/status",
  authenticate,
  authorize("employee", "admin"),
  validateUpdateStatus,
  applicationController.updateApplicationStatus,
);

// ==========================================
// Get Application By ID
// ==========================================

router.get(
  "/:id",
  authenticate,
  validateApplicationId,
  applicationController.getApplicationById,
);

module.exports = router;
