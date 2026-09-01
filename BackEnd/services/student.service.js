const StudentProfile = require("../models/StudentProfile");


const getProfileByUserId = async (userId) => {
  return await StudentProfile.findOne({ userId });
};

const createProfile = async (userId, data) => {
  const existing = await StudentProfile.findOne({ userId });
  if (existing) {
    throw new Error("Profile already exists. Use update instead.");
  }
  const profile = new StudentProfile({ userId, ...data });
  return await profile.save();
};


const updateProfile = async (userId, data) => {
  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!profile) {
    throw new Error("Profile not found.");
  }
  return profile;
};

const getCompletionPercentage = (profile) => {
  const fields = [
    "phone",
    "dateOfBirth",
    "gender",
    "nationality",
    "country",
    "university",
    "faculty",
    "department",
    "degree",
    "graduationYear",
    "GPA",
    "targetDegreeLevel",
    "englishLevel",
  ];

  const filled = fields.filter((f) => {
    const val = profile[f];
    return val !== null && val !== undefined && val !== "";
  });

  return Math.round((filled.length / fields.length) * 100);
};

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  getCompletionPercentage,
};
