const mongoose = require("mongoose");
const Scholarship = require("../models/scholarship");
const Category = require("../models/category");
const University = require("../models/university");
const Country = require("../models/country");
const { SCHOLARSHIP_STATUSES } = require("../constants");

const isStaff = (user) => user?.role === "employee" || user?.role === "admin";
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertObjectId = (id, label) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${label} ID`);
        error.statusCode = 400;
        throw error;
    }
};

const assertReferences = async ({ category, university, country, eligibleCountries = [] }) => {
    const checks = [
        [category, Category, "Category"],
        [university, University, "University"],
        [country, Country, "Country"]
    ];

    for (const [id, Model, label] of checks) {
        assertObjectId(id, label.toLowerCase());
        const exists = await Model.exists({ _id: id });
        if (!exists) {
            const error = new Error(`${label} not found`);
            error.statusCode = 404;
            throw error;
        }
    }

    for (const id of eligibleCountries) {
        assertObjectId(id, "eligible country");
    }

    if (eligibleCountries.length) {
        const uniqueIds = [...new Set(eligibleCountries.map(String))];
        const count = await Country.countDocuments({ _id: { $in: uniqueIds } });
        if (count !== uniqueIds.length) {
            const error = new Error("One or more eligible countries not found");
            error.statusCode = 404;
            throw error;
        }
    }
};

const createScholarship = async (data) => {
    await assertReferences({
        ...data,
        eligibleCountries: data.eligibility?.eligibleCountries || []
    });
    return Scholarship.create(data);
};

const validateFilters = ({ page = 1, limit = 10, minGPA, deadline }) => {
    const currentPage = Number(page);
    const currentLimit = Number(limit);

    if (!Number.isInteger(currentPage) || currentPage < 1) {
        const error = new Error("Page must be a positive integer");
        error.statusCode = 400;
        throw error;
    }

    if (!Number.isInteger(currentLimit) || currentLimit < 1 || currentLimit > 100) {
        const error = new Error("Limit must be an integer between 1 and 100");
        error.statusCode = 400;
        throw error;
    }

    let parsedGPA;
    if (minGPA !== undefined) {
        parsedGPA = Number(minGPA);
        if (!Number.isFinite(parsedGPA) || parsedGPA < 0 || parsedGPA > 4) {
            const error = new Error("minGPA must be a number between 0 and 4");
            error.statusCode = 400;
            throw error;
        }
    }

    let parsedDeadline;
    if (deadline !== undefined) {
        parsedDeadline = new Date(deadline);
        if (Number.isNaN(parsedDeadline.getTime())) {
            const error = new Error("deadline must be a valid date");
            error.statusCode = 400;
            throw error;
        }
    }

    return { currentPage, currentLimit, parsedGPA, parsedDeadline };
};

const getScholarships = async (query, user = null) => {
    const {
        search,
        country,
        category,
        university,
        fundingType,
        minGPA,
        deadline,
        status,
        page = 1,
        limit = 10
    } = query;

    const { currentPage, currentLimit, parsedGPA, parsedDeadline } = validateFilters({
        page,
        limit,
        minGPA,
        deadline
    });

    const filter = {};

    if (search) {
        filter.$or = [
            { title: { $regex: escapeRegex(search), $options: "i" } },
            { description: { $regex: escapeRegex(search), $options: "i" } },
            { provider: { $regex: escapeRegex(search), $options: "i" } }
        ];
    }

    for (const [value, field, label] of [
        [country, "country", "country"],
        [category, "category", "category"],
        [university, "university", "university"]
    ]) {
        if (value !== undefined) {
            assertObjectId(value, label);
            filter[field] = value;
        }
    }

    if (fundingType) filter.fundingType = fundingType;
    if (parsedGPA !== undefined) filter["eligibility.minGPA"] = { $lte: parsedGPA };
    if (parsedDeadline) filter.deadline = { $lte: parsedDeadline };

    // Students and unauthenticated users can only see published scholarships.
    // Employee/Admin can filter by any supported status.
    if (isStaff(user)) {
        if (status !== undefined && status !== "") {
            const normalizedStatus = String(status).trim().toLowerCase();
            if (!SCHOLARSHIP_STATUSES.includes(normalizedStatus)) {
                const error = new Error("Invalid status");
                error.statusCode = 400;
                throw error;
            }
            filter.status = normalizedStatus;
        }
    } else {
        filter.status = "published";
    }

    const skip = (currentPage - 1) * currentLimit;

    const [scholarships, total] = await Promise.all([
        Scholarship.find(filter)
            .populate("category")
            .populate("university")
            .populate("country")
            .populate("eligibility.eligibleCountries")
            .skip(skip)
            .limit(currentLimit)
            .sort({ createdAt: -1 }),
        Scholarship.countDocuments(filter)
    ]);

    return {
        data: scholarships,
        pagination: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages: Math.ceil(total / currentLimit)
        }
    };
};

const getScholarshipById = async (id, user = null) => {
    assertObjectId(id, "scholarship");

    const filter = { _id: id };
    if (!isStaff(user)) filter.status = "published";

    const scholarship = await Scholarship.findOne(filter)
        .populate("category")
        .populate("university")
        .populate("country")
        .populate("eligibility.eligibleCountries");

    if (!scholarship) {
        const error = new Error("Scholarship not found");
        error.statusCode = 404;
        throw error;
    }

    return scholarship;
};

const updateScholarship = async (id, data) => {
    assertObjectId(id, "scholarship");

    const current = await Scholarship.findById(id);
    if (!current) {
        const error = new Error("Scholarship not found");
        error.statusCode = 404;
        throw error;
    }

    const currentObject = current.toObject();
    const resolved = {
        ...currentObject,
        ...data,
        eligibility: data.eligibility
            ? { ...(currentObject.eligibility || {}), ...data.eligibility }
            : currentObject.eligibility
    };

    if (data.category || data.university || data.country || data.eligibility?.eligibleCountries) {
        await assertReferences({
            category: resolved.category,
            university: resolved.university,
            country: resolved.country,
            eligibleCountries: resolved.eligibility?.eligibleCountries || []
        });
    }

    const update = { ...data };
    if (data.eligibility) {
        update.eligibility = resolved.eligibility;
    }

    return Scholarship.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }
    );
};

const deleteScholarship = async (id) => {
    assertObjectId(id, "scholarship");
    const scholarship = await Scholarship.findByIdAndDelete(id);
    if (!scholarship) {
        const error = new Error("Scholarship not found");
        error.statusCode = 404;
        throw error;
    }
    return scholarship;
};

module.exports = {
    createScholarship,
    getScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship
};
