const Scholarship = require("../models/scholarship");
const Country = require("../models/country");
const { GENDER_VALUES } = require("../constants");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const checkEligibility = async ({ GPA, nationality, degree, field, age, gender }) => {
    if (GPA !== undefined && (!Number.isFinite(Number(GPA)) || Number(GPA) < 0 || Number(GPA) > 4)) {
        const error = new Error("GPA must be a number between 0 and 4");
        error.statusCode = 400;
        throw error;
    }

    if (age !== undefined && (!Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 100)) {
        const error = new Error("Age must be an integer between 0 and 100");
        error.statusCode = 400;
        throw error;
    }

    if (gender !== undefined && !GENDER_VALUES.includes(gender)) {
        const error = new Error("Invalid gender");
        error.statusCode = 400;
        throw error;
    }

    let country = null;
    if (nationality !== undefined) {
        country = await Country.findOne({
            name: { $regex: `^${escapeRegex(nationality)}$`, $options: "i" }
        });
    }

    const scholarships = await Scholarship.find({ status: "published" })
        .populate("eligibility.eligibleCountries");

    return scholarships.filter((scholarship) => {
        const eligibility = scholarship.eligibility || {};

        if (eligibility.minGPA !== undefined) {
            if (GPA === undefined || Number(GPA) < eligibility.minGPA) return false;
        }

        if (eligibility.maxAge !== undefined) {
            if (age === undefined || Number(age) > eligibility.maxAge) return false;
        }

        if (eligibility.eligibleCountries?.length > 0) {
            if (!country) return false;
            const allowed = eligibility.eligibleCountries.some(
                (eligibleCountry) => eligibleCountry._id.toString() === country._id.toString()
            );
            if (!allowed) return false;
        }

        if (eligibility.eligibleDegrees?.length > 0) {
            if (!degree) return false;
            const allowed = eligibility.eligibleDegrees.some(
                (eligibleDegree) => eligibleDegree.toLowerCase() === degree.toLowerCase()
            );
            if (!allowed) return false;
        }

        if (eligibility.eligibleFields?.length > 0) {
            if (!field) return false;
            const allowed = eligibility.eligibleFields.some(
                (eligibleField) => eligibleField.toLowerCase() === field.toLowerCase()
            );
            if (!allowed) return false;
        }

        if (eligibility.gender) {
            if (!gender || eligibility.gender.toLowerCase() !== gender.toLowerCase()) return false;
        }

        return true;
    });
};

module.exports = { checkEligibility };
