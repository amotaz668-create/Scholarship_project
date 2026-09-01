const { param, validationResult } = require("express-validator");

const validateNotificationId = [
  param("id").isMongoId().withMessage("Invalid notification id"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateNotificationId,
};
