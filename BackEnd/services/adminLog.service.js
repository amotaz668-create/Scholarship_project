const AdminLog = require("../models/AdminLog");

// Create Admin Log
const createLog = async (
  adminId,
  action,
  targetType,
  targetId = null,
  details = "",
) => {
  const log = await AdminLog.create({
    adminId,
    action,
    targetType,
    targetId,
    details,
  });

  return log;
};

// Get All Admin Logs
const getAllLogs = async () => {
  const logs = await AdminLog.find()
    .populate("adminId", "email role")
    .sort({ createdAt: -1 });

  return logs;
};

// Get Admin Log By ID
const getLogById = async (logId) => {
  const log = await AdminLog.findById(logId).populate("adminId", "email role");

  return log;
};

module.exports = {
  createLog,
  getAllLogs,
  getLogById,
};
