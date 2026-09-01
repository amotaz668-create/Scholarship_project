const Joi = require("joi");

const categoryValidator = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().max(500).optional()
});

const categoryUpdateValidator = categoryValidator.fork(
    ["name", "description"],
    (schema) => schema.optional()
).min(1);

module.exports = { categoryValidator, categoryUpdateValidator };
