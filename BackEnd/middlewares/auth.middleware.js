
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ==========================================
// Get Token From Request
// ==========================================
const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    // Support: Authorization: Bearer <token>
    if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice(7).trim();
        return token || null;
    }

    // Also support raw token
    return authHeader.trim() || null;
};

// ==========================================
// Authentication Middleware
// ==========================================
const authenticate = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Support different environment variable names
        const secret =
            process.env.JWT_SECRET ||
            process.env.SECRETKAY ||
            process.env.SECRET_KEY;

        if (!secret) {
            throw new Error("JWT secret is not configured");
        }

        const decoded = jwt.verify(token, secret);

        // Support both userId and id inside JWT payload
        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload."
            });
        }

        // Get user from database
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists."
            });
        }

        // Check if account is active
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        // Attach authenticated user to request
        req.user = user;

        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        next(error);
    }
};

// ==========================================
// Optional Authentication Middleware
// ==========================================
// Allows the request to continue even without a token.
// If a valid token exists, req.user will be available.

const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        // No token → continue as guest
        if (!token) {
            return next();
        }

        const secret =
            process.env.JWT_SECRET ||
            process.env.SECRETKAY ||
            process.env.SECRET_KEY;

        if (!secret) {
            throw new Error("JWT secret is not configured");
        }

        const decoded = jwt.verify(token, secret);

        const userId = decoded.userId || decoded.id;

        if (!userId) {
            return next();
        }

        const user = await User.findById(userId).select("-password");

        if (user && user.isActive !== false) {
            req.user = user;
        }

        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        next(error);
    }
};

// ==========================================
// Authorization Middleware
// ==========================================
// Usage:
// authorize("admin")
// authorize("admin", "employee")

const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions."
            });
        }

        next();
    };
};

// ==========================================
// Exports
// ==========================================

module.exports = {
    authenticate,
    optionalAuthenticate,
    authorize
};

