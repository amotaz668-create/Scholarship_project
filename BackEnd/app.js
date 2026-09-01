const express = require("express");
const cors = require("cors");

const app = express();

// ==============================
// Routes
// ==============================

const userRoutes = require("./routes/user.routes");

const scholarshipRoutes = require("./routes/scholarship_routes");

const applicationRoutes = require("./routes/application");

const categoryRoutes = require("./routes/category_routes");

const universityRoutes = require("./routes/university_routes");

const countryRoutes = require("./routes/country_routes");

const notificationRoutes = require("./routes/notification.routes");

const adminRoutes = require("./routes/admin.routes");

const adminLogRoutes = require("./routes/adminLog.routes");

const studentRoutes = require("./routes/student.routes");

const documentRoutes = require("./routes/document.routes");

// ==============================
// Middlewares
// ==============================

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// ==============================
// User / Auth
// ==============================

app.use("/api", userRoutes);

// ==============================
// Scholarships
// ==============================

app.use("/api/scholarships", scholarshipRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/universities", universityRoutes);

app.use("/api/countries", countryRoutes);

// ==============================
// Applications
// ==============================

app.use("/api/applications", applicationRoutes);

// ==============================
// Notifications
// ==============================

app.use("/api/notifications", notificationRoutes);

// ==============================
// Admin
// ==============================

app.use("/api/admin/logs", adminLogRoutes);

app.use("/api/admin", adminRoutes);

// ==============================
// Student
// ==============================

app.use("/api/student/documents", documentRoutes);

app.use("/api/student", studentRoutes);

// ==============================
// 404
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==============================
// Global Error Handler
// ==============================

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === "entity.parse.failed"
  ) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON",
    });
  }

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;
