const {
  scholarshipValidator,
  scholarshipUpdateValidator,
} = require("../validators/scholarship_validator");

const scholarshipService = require("../services/scholarship_service");

const { checkEligibility } = require("../services/eligibility_service");

const { createLog } = require("../services/adminLog.service");

// ==========================================
// Error Handler
// ==========================================

const handleError = (res, error) => {
  const status = error.statusCode || 500;

  return res.status(status).json({
    message: status === 500 ? "Internal server error" : error.message,
  });
};

// ==========================================
// Create Scholarship
// ==========================================

const createScholarship = async (req, res) => {
  try {
    const { error, value } = scholarshipValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const scholarship = await scholarshipService.createScholarship(value);

    res.status(201).json({
      message: "Scholarship created successfully",
      data: scholarship,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Get Scholarships
// ==========================================

const getScholarships = async (req, res) => {
  try {
    const result = await scholarshipService.getScholarships(
      req.query,
      req.user,
    );

    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Get Scholarship By ID
// ==========================================

const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await scholarshipService.getScholarshipById(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      data: scholarship,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Update Scholarship
// ==========================================

const updateScholarship = async (req, res) => {
  try {
    const { error, value } = scholarshipUpdateValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const scholarship = await scholarshipService.updateScholarship(
      req.params.id,
      value,
    );

    res.status(200).json({
      message: "Scholarship updated successfully",
      data: scholarship,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Delete Scholarship
// ==========================================

const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await scholarshipService.deleteScholarship(
      req.params.id,
    );

    // Admin Log
    if (req.user && req.user.role === "admin") {
      await createLog(
        req.user._id,
        "DELETE_SCHOLARSHIP",
        "SCHOLARSHIP",
        scholarship._id,
        `Admin deleted scholarship: ${scholarship.title}`,
      );
    }

    res.status(200).json({
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Check Scholarship Eligibility
// ==========================================

const checkScholarshipEligibility = async (req, res) => {
  try {
    const eligibleScholarships = await checkEligibility(req.body);

    res.status(200).json({
      data: eligibleScholarships,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  checkScholarshipEligibility,
};
