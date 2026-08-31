const mongoose = require("mongoose");
const { GENDER_VALUES } = require("../constants");

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Personal Info
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: GENDER_VALUES,
    },
    nationality: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String, trim: true },

    // Academic Info
    university: { type: String, trim: true },
    faculty: { type: String, trim: true },
    department: { type: String, trim: true },
    degree: {
      type: String,
      enum: ["Bachelor", "Master", "PhD"],
    },
    graduationYear: {
      type: Number,
      min: 1990,
      max: 2100,
    },
    GPA: {
      type: Number,
      min: 0,
      max: 4,
    },

    // Study Target
    targetDegreeLevel: {
      type: String,
      enum: ["Bachelor", "Master", "PhD"],
    },
    preferredMajors: [{ type: String, trim: true }],
    preferredCountries: [{ type: String, trim: true }],

    // Language
    englishLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    IELTS: { type: Number, min: 0, max: 9 },
    TOEFL: { type: Number, min: 0, max: 120 },

    // Extra
    skills: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    bio: { type: String, maxlength: 1000, trim: true },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholarship",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
