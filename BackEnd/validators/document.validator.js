const { body, param, validationResult } = require("express-validator");

const uploadValidationRules = [
  body("type")
    .notEmpty()
    .withMessage("Document type is required.")
    .isString()
    .isLength({ max: 100 })
    .withMessage("Document type must be 100 characters or fewer."),
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
