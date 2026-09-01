const adminLogService = require("../services/adminLog.service");

// Get All Logs
const getLogs = async (req, res) => {
  try {
    const logs = await adminLogService.getAllLogs();

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Log By ID
const getLogById = async (req, res) => {
  try {
    const log = await adminLogService.getLogById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found",
      });
    }

    res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getLogs,
  getLogById,
};
