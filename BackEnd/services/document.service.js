const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");


const uploadDocument = async (studentId, file, type) => {

  const existing = await Document.findOne({ studentId, type });
  if (existing) {
 
    if (existing.fileUrl && existing.fileUrl.startsWith("/uploads")) {
      const oldPath = path.join(__dirname, "../../..", existing.fileUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await Document.findByIdAndDelete(existing._id);
  }

  const doc = new Document({
    studentId,
    type,
    fileName: file.originalname,
    fileUrl: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    fileSize: file.size,
    status: "pending",
    uploadedAt: new Date(),
  });

  return await doc.save();
};

const getDocumentsByStudent = async (studentId) => {
  return await Document.find({ studentId }).sort({ uploadedAt: -1 });
};

const getDocumentById = async (docId, studentId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found.");
  if (doc.studentId.toString() !== studentId.toString()) {
    throw new Error("Unauthorized.");
  }
  return doc;
};


const deleteDocument = async (docId, studentId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found.");
  if (doc.studentId.toString() !== studentId.toString()) {
    throw new Error("Unauthorized.");
  }

 
  if (doc.fileUrl && doc.fileUrl.startsWith("/uploads")) {
    const filePath = path.join(__dirname, "../../..", doc.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await Document.findByIdAndDelete(docId);
  return { message: "Document deleted successfully." };
};

const getDocumentReadiness = async (studentId, requiredDocTypes) => {
  const studentDocs = await Document.find({
    studentId,
    type: { $in: requiredDocTypes },
    status: "approved",
  });

  const uploadedTypes = studentDocs.map((d) => d.type);
  const missingDocuments = requiredDocTypes.filter(
    (t) => !uploadedTypes.includes(t)
  );

  return {
    ready: missingDocuments.length === 0,
    uploadedDocuments: uploadedTypes,
    missingDocuments,
    totalRequired: requiredDocTypes.length,
    totalUploaded: uploadedTypes.length,
  };
};

module.exports = {
  uploadDocument,
  getDocumentsByStudent,
  getDocumentById,
  deleteDocument,
  getDocumentReadiness,
};
