const express = require("express");

const router = express.Router();

const {
  authenticate,
  optionalAuthenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  checkScholarshipEligibility,
} = require("../controller/scholarship_controller");

// ==========================================
// Get All Scholarships
// ==========================================

router.get("/", optionalAuthenticate, getScholarships);

// ==========================================
// Check Eligibility
// ==========================================

router.post("/check-eligibility", checkScholarshipEligibility);

// ==========================================
// Create Scholarship
// ==========================================

router.post(
  "/",
  authenticate,
  authorize("employee", "admin"),
  createScholarship,
);

// ==========================================
// Get Scholarship By ID
// ==========================================

router.get("/:id", optionalAuthenticate, getScholarshipById);

// ==========================================
// Update Scholarship
// ==========================================

router.patch(
  "/:id",
  authenticate,
  authorize("employee", "admin"),
  updateScholarship,
);

// ==========================================
// Delete Scholarship
// Admin Only
// ==========================================

router.delete("/:id", authenticate, authorize("admin"), deleteScholarship);

module.exports = router;
