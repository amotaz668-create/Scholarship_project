const joi = require("joi");
const { GENDER_VALUES, SCHOLARSHIP_STATUSES } = require("../constants");

const scholarshipValidator = joi.object({
    title: joi.string().trim().min(2).max(200).required(),
    description: joi.string().trim().min(10).required(),
    provider: joi.string().trim().required(),
    category: joi.string().hex().length(24).required(),
    university: joi.string().hex().length(24).required(),
    country: joi.string().hex().length(24).required(),
    fundingType: joi.string().trim().required(),
    amount: joi.number().min(0).optional(),
    currency: joi.string().trim().uppercase().optional(),
    deadline: joi.date().required(),
    applicationUrl: joi.string().uri().optional(),

    eligibility: joi.object({
        minGPA: joi.number().min(0).max(4).optional(),
        maxAge: joi.number().integer().min(0).max(100).optional(),
        eligibleCountries: joi.array().items(joi.string().hex().length(24)).optional(),
        eligibleDegrees: joi.array().items(joi.string().trim().min(1)).optional(),
        eligibleFields: joi.array().items(joi.string().trim().min(1)).optional(),
        gender: joi.string().valid(...GENDER_VALUES).optional()
    }).optional(),

    requiredDocuments: joi.array().items(
        joi.object({
            type: joi.string().trim().min(1).required(),
            required: joi.boolean().default(true)
        })
    ).optional(),

    status: joi.string().valid(...SCHOLARSHIP_STATUSES).optional()
});

const scholarshipUpdateValidator = scholarshipValidator.fork(
    [
        "title",
        "description",
        "provider",
        "category",
        "university",
        "country",
        "fundingType",
        "amount",
        "currency",
        "deadline",
        "applicationUrl",
        "eligibility",
        "requiredDocuments",
        "status"
    ],
    (schema) => schema.optional()
).min(1);

module.exports = {
    scholarshipValidator,
    scholarshipUpdateValidator
};