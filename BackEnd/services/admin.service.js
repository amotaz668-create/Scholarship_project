const User = require("../models/user");
const Scholarship = require("../models/scholarship");
const Application = require("../models/application");

// ================= Dashboard =================

const getDashboardStatistics = async () => {
  const [
    totalUsers,
    totalStudents,
    totalScholarships,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "student",
    }),

    Scholarship.countDocuments(),

    Application.countDocuments(),

    // submitted = pending
    Application.countDocuments({
      status: "submitted",
    }),

    Application.countDocuments({
      status: "accepted",
    }),

    Application.countDocuments({
      status: "rejected",
    }),
  ]);

  return {
    totalUsers,
    totalStudents,
    totalScholarships,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
  };
};

// ================= Statistics =================

const getAdminStatistics = async () => {
  // Applications By Status
  const applicationsByStatus = await Application.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  // Scholarships By Degree
  const scholarshipsByDegree = await Scholarship.aggregate([
    {
      $unwind: "$eligibility.eligibleDegrees",
    },
    {
      $group: {
        _id: "$eligibility.eligibleDegrees",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  // Applications Per Employee
  const applicationsPerEmployee = await Application.aggregate([
    {
      $match: {
        assignedEmployeeId: {
          $ne: null,
        },
      },
    },

    {
      $group: {
        _id: "$assignedEmployeeId",
        count: {
          $sum: 1,
        },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },

    {
      $unwind: {
        path: "$employee",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,
        employeeId: "$_id",
        employeeName: "$employee.name",
        employeeEmail: "$employee.email",
        count: 1,
      },
    },
  ]);

  return {
    applicationsByStatus,
    scholarshipsByDegree,
    applicationsPerEmployee,
  };
};

module.exports = {
  getDashboardStatistics,
  getAdminStatistics,
};
