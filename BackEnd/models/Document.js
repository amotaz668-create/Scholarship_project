const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String },
    fileSize: { type: Number }, 

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "under_review", "needs_update"],
      default: "pending",
    },
    reviewNote: { type: String, trim: true },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


documentSchema.index({ studentId: 1, type: 1 });

module.exports = mongoose.model("Document", documentSchema);
