const Joi = require("joi");

const countryValidator = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    code: Joi.string().trim().uppercase().length(2).required()
});

const countryUpdateValidator = countryValidator.fork(
    ["name", "code"],
    (schema) => schema.optional()
).min(1);

module.exports = { countryValidator, countryUpdateValidator };
