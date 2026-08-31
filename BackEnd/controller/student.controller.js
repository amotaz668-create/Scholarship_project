const studentService = require("../services/student.service");

const getProfile = async (req, res) => {
  try {
    const profile = await studentService.getProfileByUserId(req.user._id);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    const completion = studentService.getCompletionPercentage(profile);

    res.status(200).json({
      success: true,
      data: { profile, completionPercentage: completion },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createProfile = async (req, res) => {
  try {
    const profile = await studentService.createProfile(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      data: profile,
    });
  } catch (error) {
    const status = error.message.includes("already exists") ? 409 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await studentService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, createProfile, updateProfile };
