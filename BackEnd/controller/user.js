const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = require("../services/user.service");

const { createLog } = require("../services/adminLog.service");

const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  updateUserValidator,
  createStaffValidator,
  objectIdValidator,
} = require("../validators/user.validator");

// ==========================================
// Register Student
// ==========================================

const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userService.createUser({
      name: value.name,
      email: value.email,
      password: value.password,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

// ==========================================
// Login
// ==========================================

const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userService.findByEmail(value.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const passwordMatch = await bcrypt.compare(value.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const secret =
      process.env.JWT_SECRET || process.env.SECRETKAY || process.env.SECRET_KEY;

    if (!secret) {
      throw new Error("JWT secret is not configured");
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Current User
// ==========================================

const getMe = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Current User Profile
// ==========================================

const updateMe = async (req, res, next) => {
  try {
    const { error, value } = updateProfileValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userService.updateUser(req.user._id, value);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

// ==========================================
// Get All Users
// ==========================================

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers({
      role: req.query.role,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get User By ID
// ==========================================

const getUserById = async (req, res, next) => {
  try {
    const { error } = objectIdValidator.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await userService.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Admin Update User
// ==========================================

const updateUser = async (req, res, next) => {
  try {
    const idValidation = objectIdValidator.validate(req.params);

    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { error, value } = updateUserValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userService.updateUser(req.params.id, value);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

// ==========================================
// Create Employee / Admin
// ==========================================

const createStaff = async (req, res, next) => {
  try {
    const { error, value } = createStaffValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await userService.createUser(value);

    return res.status(201).json({
      success: true,
      message: `${value.role} account created successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

// ==========================================
// Activate / Deactivate User
// ==========================================

const changeUserStatus = async (req, res, next) => {
  try {
    const { error } = objectIdValidator.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const isActive = req.body.isActive;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const user = await userService.changeUserStatus(req.params.id, isActive);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // Admin Log When User Is Deactivated
    // ==========================================

    if (!isActive) {
      await createLog(
        req.user._id,
        "DEACTIVATE_USER",
        "USER",
        user._id,
        `Admin deactivated user: ${user.email}`,
      );
    }

    return res.status(200).json({
      success: true,

      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete User
// ==========================================

const deleteUser = async (req, res, next) => {
  try {
    const { error } = objectIdValidator.validate(req.params);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent admin from deleting himself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await userService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  updateUser,
  createStaff,
  changeUserStatus,
  deleteUser,
};
