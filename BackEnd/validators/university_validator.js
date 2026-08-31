const Joi = require("joi");

const universityValidator = Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    country: Joi.string().trim().min(2).max(100).required(),
    city: Joi.string().trim().min(2).max(100).required(),
    website: Joi.string().uri().optional()
});

const universityUpdateValidator = universityValidator.fork(
    ["name", "country", "city", "website"],
    (schema) => schema.optional()
).min(1);

module.exports = { universityValidator, universityUpdateValidator };
