const { body, param, validationResult } = require("express-validator");

const ALLOWED_DOC_TYPES = [
  "CV",
  "Passport",
  "Transcript",
  "GraduationCertificate",
  "RecommendationLetter",
  "MotivationLetter",
  "LanguageCertificate",
  "Other",
];

const uploadValidationRules = [
  body("type")
    .notEmpty()
    .withMessage("Document type is required.")
    .isIn(ALLOWED_DOC_TYPES)
    .withMessage(`Document type must be one of: ${ALLOWED_DOC_TYPES.join(", ")}.`),
];

const idParamRule = [
  param("id")
    .isMongoId()
    .withMessage("Invalid document ID."),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { uploadValidationRules, idParamRule, validate };
