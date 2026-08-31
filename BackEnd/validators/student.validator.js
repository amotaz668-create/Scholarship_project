const { body, validationResult } = require("express-validator");
const { GENDER_VALUES } = require("../constants");

const profileValidationRules = [
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number."),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format. Use YYYY-MM-DD."),

  body("gender")
    .optional()
    .isIn(GENDER_VALUES)
    .withMessage("Gender must be Male or Female."),

  body("GPA")
    .optional()
    .isFloat({ min: 0, max: 4 })
    .withMessage("GPA must be between 0 and 4."),

  body("graduationYear")
    .optional()
    .isInt({ min: 1990, max: 2100 })
    .withMessage("Graduation year must be between 1990 and 2100."),

  body("degree")
    .optional()
    .isIn(["Bachelor", "Master", "PhD"])
    .withMessage("Degree must be Bachelor, Master, or PhD."),

  body("targetDegreeLevel")
    .optional()
    .isIn(["Bachelor", "Master", "PhD"])
    .withMessage("Target degree must be Bachelor, Master, or PhD."),

  body("englishLevel")
    .optional()
    .isIn(["A1", "A2", "B1", "B2", "C1", "C2"])
    .withMessage("English level must be A1, A2, B1, B2, C1, or C2."),

  body("IELTS")
    .optional()
    .isFloat({ min: 0, max: 9 })
    .withMessage("IELTS score must be between 0 and 9."),

  body("TOEFL")
    .optional()
    .isFloat({ min: 0, max: 120 })
    .withMessage("TOEFL score must be between 0 and 120."),

  body("bio")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Bio must not exceed 1000 characters."),
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

module.exports = { profileValidationRules, validate };
