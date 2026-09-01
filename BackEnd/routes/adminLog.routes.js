const express = require("express");

const router = express.Router();

const { getLogs, getLogById } = require("../controller/adminLog.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Get All Logs
router.get("/", authenticate, authorize("admin"), getLogs);

// Get Log By ID
router.get("/:id", authenticate, authorize("admin"), getLogById);

module.exports = router;
