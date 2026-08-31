const joi = require("joi");
const {
    GENDER_VALUES,
    SCHOLARSHIP_STATUSES,
    APPLICATION_REQUIREMENT_TYPES,
    APPLICATION_REQUIREMENT_SOURCES,
    APPLICATION_PROFILE_FIELDS
} = require("../constants");

const applicationRequirementValidator = joi.object({
    key: joi.string().trim().pattern(/^[A-Za-z][A-Za-z0-9_.-]*$/).required(),
    label: joi.string().trim().min(1).max(200).required(),
    labelAr: joi.string().trim().max(200).allow("").optional(),
    type: joi.string().valid(...APPLICATION_REQUIREMENT_TYPES).required(),
    required: joi.boolean().default(true),
    options: joi.array().items(joi.string().trim().min(1)).default([]),
    source: joi.string().valid(...APPLICATION_REQUIREMENT_SOURCES).required(),
    profileField: joi.when("source", {
        is: "profile",
        then: joi.string().valid(...APPLICATION_PROFILE_FIELDS).required(),
        otherwise: joi.forbidden()
    })
});

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

    applicationRequirements: joi.array()
        .items(applicationRequirementValidator)
        .unique("key")
        .optional(),

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
        "applicationRequirements",
        "status"
    ],
    (schema) => schema.optional()
).min(1);

module.exports = {
    scholarshipValidator,
    scholarshipUpdateValidator
};
