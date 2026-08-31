const Joi = require("joi");

// ==============================
// Register
// ==============================
const registerValidator = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(128)
        .required(),

    // Public registration should create students only.
    // Employee/Admin accounts should be created by an Admin.
    role: Joi.forbidden()
});


// ==============================
// Login
// ==============================
const loginValidator = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .required()
});


// ==============================
// Update My Profile
// ==============================
const updateProfileValidator = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    email: Joi.string()
        .trim()
        .lowercase()
        .email(),

    password: Joi.string()
        .min(6)
        .max(128)
}).min(1);


// ==============================
// Admin Update User
// ==============================
const updateUserValidator = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    email: Joi.string()
        .trim()
        .lowercase()
        .email(),

    password: Joi.string()
        .min(6)
        .max(128),

    role: Joi.string()
        .valid("student", "employee", "admin"),

    isActive: Joi.boolean()
}).min(1);


// ==============================
// Create Employee/Admin
// ==============================
const createStaffValidator = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(128)
        .required(),

    role: Joi.string()
        .valid("employee", "admin")
        .required()
});


// ==============================
// MongoDB ObjectId
// ==============================
const objectIdValidator = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
});


module.exports = {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    updateUserValidator,
    createStaffValidator,
    objectIdValidator
};