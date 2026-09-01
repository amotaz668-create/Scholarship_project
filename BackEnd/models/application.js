const mongoose = require('mongoose');

// Define this explicitly because the document metadata itself has a field named
// `type`. When the object is declared inline, Mongoose can interpret that field
// as the array's schema type and cast the entire `documents` path to [String].
const applicationDocumentSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    name: { type: String, trim: true, maxlength: 100 },
    type: { type: String, trim: true, maxlength: 100 },
    fileName: { type: String, trim: true, maxlength: 255 },
    fileUrl: { type: String, trim: true, maxlength: 2048 },
    mimeType: { type: String, trim: true, maxlength: 100 },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', //  <<<<< اللي ماسك اليوزر يكتب الأسم الصح 
    required: true
  },

  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',   //  <<<<< اللي ماسك المنح يكتب الأسم الصح 
    required: true
  },

  scholarshipTitle: {
    type: String,
    required: true
  },

  assignedEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',   //  <<<<< اللي ماسك اليوزر يكتب الأسم الصح 
    default: null
  },

  documents: {
    type: [applicationDocumentSchema],
    default: [],
  },

  answers: [
    {
      requirementKey: String,
      question: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ],

  profileData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  profileSnapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  status: {
    type: String,
    enum: [
      "draft",
      "submitted",    // تعادل pending في متطلبات المشروع
      "under_review",
      "missing_documents", 
      "accepted",
      "rejected",
      "withdrawn"
    ],
    default: "draft"
  },
  
  timeline: [
    {
      oldStatus: String,
      newStatus: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      note: String,
      date: { type: Date , default: Date.now }
    }
  ],

  notes : String ,

  submittedAt: Date,

  reviewedAt: Date,
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
},

 {
  timestamps: true 
});

// لمنع الطالب من التقديم على نفس المنحة أكثر من مرة على مستوى الداتابيز
applicationSchema.index({ studentId: 1, scholarshipId: 1 });
// Index إضافي لتسريع البحث عند عرض طلبات موظف معين
applicationSchema.index({ assignedEmployeeId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
