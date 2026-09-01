const bcrypt = require("bcrypt");
const User = require("../models/user");

// ==============================
// Create User
// ==============================
const createUser = async ({ name, email, password, role = "student" }) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    return user;
};


// ==============================
// Find User By Email
// ==============================
const findByEmail = async (email) => {
    return User.findOne({ email });
};


// ==============================
// Find User By ID
// ==============================
const findById = async (id) => {
    return User.findById(id).select("-password");
};


// ==============================
// Change Authenticated User Password
// ==============================
const changePassword = async (id, currentPassword, newPassword) => {
    const user = await User.findById(id).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const currentMatches = await bcrypt.compare(currentPassword, user.password);
    if (!currentMatches) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 401;
        throw error;
    }

    const reusesCurrentPassword = await bcrypt.compare(newPassword, user.password);
    if (reusesCurrentPassword) {
        const error = new Error("New password must be different from the current password");
        error.statusCode = 400;
        throw error;
    }

    // User has no password hashing save hook, so hash once here and write the
    // completed hash directly. No password value is returned from this method.
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
};


// ==============================
// Get All Users
// ==============================
const getAllUsers = async (filters = {}) => {

    const query = {};

    if (filters.role) {
        query.role = filters.role;
    }

    if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
    }

    if (filters.search) {
        query.$or = [
            {
                name: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: filters.search,
                    $options: "i"
                }
            }
        ];
    }

    return User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });
};


// ==============================
// Update User
// ==============================
const updateUser = async (id, data) => {

    const updateData = { ...data };

    if (updateData.password) {
        updateData.password = await bcrypt.hash(
            updateData.password,
            10
        );
    }

    return User.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};


// ==============================
// Delete User
// ==============================
const deleteUser = async (id) => {
    return User.findByIdAndDelete(id);
};


// ==============================
// Change User Status
// ==============================
const changeUserStatus = async (id, isActive) => {

    return User.findByIdAndUpdate(
        id,
        { isActive },
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};


module.exports = {
    createUser,
    findByEmail,
    findById,
    changePassword,
    getAllUsers,
    updateUser,
    deleteUser,
    changeUserStatus
};
