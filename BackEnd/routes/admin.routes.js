const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getStatistics,
} = require("../controller/admin.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Admin Dashboard
router.get("/dashboard", authenticate, authorize("admin"), getDashboard);

// Admin Statistics
router.get("/statistics", authenticate, authorize("admin"), getStatistics);

module.exports = router;
