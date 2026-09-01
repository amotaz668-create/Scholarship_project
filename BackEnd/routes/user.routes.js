const express = require("express");

const {
    register,
    login,
    getMe,
    updateMe,
    changePassword,
    getAllUsers,
    getUserById,
    updateUser,
    createStaff,
    changeUserStatus,
    deleteUser
} = require("../controller/user.js");

const {
    authenticate,
    authorize
} = require("../middlewares/auth.middleware");

const router = express.Router();


// ==========================================
// Authentication
// ==========================================

// Public
router.post("/auth/register", register);
router.post("/auth/login", login);


// ==========================================
// Current User
// ==========================================

router.get(
    "/users/me",
    authenticate,
    getMe
);

router.patch(
    "/users/me",
    authenticate,
    updateMe
);

router.patch(
    "/users/me/password",
    authenticate,
    changePassword
);


// ==========================================
// Admin User Management
// ==========================================

// Get all users
router.get(
    "/users",
    authenticate,
    authorize("admin"),
    getAllUsers
);

// Get user by ID
router.get(
    "/users/:id",
    authenticate,
    authorize("admin"),
    getUserById
);

// Update user
router.patch(
    "/users/:id",
    authenticate,
    authorize("admin"),
    updateUser
);

// Create Employee/Admin
router.post(
    "/users/staff",
    authenticate,
    authorize("admin"),
    createStaff
);

// Activate / Deactivate
router.patch(
    "/users/:id/status",
    authenticate,
    authorize("admin"),
    changeUserStatus
);

// Delete user
router.delete(
    "/users/:id",
    authenticate,
    authorize("admin"),
    deleteUser
);


module.exports = router;
