const mongoose = require('mongoose');

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

  documents: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
      name: String,
      fileUrl: String
    }
  ],

  answers: [
    {
      question: String,
      answer: String
    }
  ],

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