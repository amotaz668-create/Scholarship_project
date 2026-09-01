const adminService = require("../services/admin.service");

// ================= Dashboard =================

const getDashboard = async (req, res) => {
  try {
    const statistics = await adminService.getDashboardStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Statistics =================

const getStatistics = async (req, res) => {
  try {
    const statistics = await adminService.getAdminStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getStatistics,
};
