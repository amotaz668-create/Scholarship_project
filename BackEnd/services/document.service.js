const Document = require("../models/Document");
const Application = require("../models/application");
const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../middlewares/upload.middleware");

const storedFilePath = (doc) => {
  const fileName = path.basename(String(doc.fileUrl || ""));
  if (!fileName || doc.fileUrl !== `/uploads/${fileName}`) {
    const error = new Error("Invalid stored document path.");
    error.statusCode = 400;
    throw error;
  }
  const filePath = path.resolve(UPLOAD_DIR, fileName);
  if (!filePath.startsWith(`${UPLOAD_DIR}${path.sep}`)) {
    const error = new Error("Invalid stored document path.");
    error.statusCode = 400;
    throw error;
  }
  return filePath;
};


const uploadDocument = async (studentId, file, type) => {

  const existing = await Document.findOne({ studentId, type }).sort({ uploadedAt: -1 });
  if (existing) {
    const usedByApplication = await Application.exists({ "documents.documentId": existing._id });
    if (!usedByApplication) {
      const oldPath = storedFilePath(existing);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      await Document.findByIdAndDelete(existing._id);
    }
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
  const documents = await Document.find({ studentId }).sort({ uploadedAt: -1 });
  const seen = new Set();
  return documents.filter((document) => {
    if (seen.has(document.type)) return false;
    seen.add(document.type);
    return true;
  });
};

const getDocumentById = async (docId, user) => {
  const doc = await Document.findById(docId);
  if (!doc) {
    const error = new Error("Document not found.");
    error.statusCode = 404;
    throw error;
  }

  const ownsDocument = doc.studentId.toString() === user._id.toString();
  if (user.role === "student" && !ownsDocument) {
    const error = new Error("Forbidden.");
    error.statusCode = 403;
    throw error;
  }

  if (user.role === "employee") {
    const assigned = await Application.exists({
      assignedEmployeeId: user._id,
      "documents.documentId": doc._id,
    });
    if (!assigned) {
      const error = new Error("Forbidden.");
      error.statusCode = 403;
      throw error;
    }
  } else if (user.role !== "student" && user.role !== "admin") {
    const error = new Error("Forbidden.");
    error.statusCode = 403;
    throw error;
  }
  return doc;
};

const getDocumentFile = async (docId, user) => {
  const document = await getDocumentById(docId, user);
  const filePath = storedFilePath(document);
  if (!fs.existsSync(filePath)) {
    const error = new Error("Document file not found.");
    error.statusCode = 404;
    throw error;
  }
  return { document, filePath };
};


const deleteDocument = async (docId, studentId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found.");
  if (doc.studentId.toString() !== studentId.toString()) {
    throw new Error("Unauthorized.");
  }

  if (await Application.exists({ "documents.documentId": doc._id })) {
    const error = new Error("A document attached to an application cannot be deleted.");
    error.statusCode = 409;
    throw error;
  }

 
  if (doc.fileUrl && doc.fileUrl.startsWith("/uploads")) {
    const filePath = storedFilePath(doc);
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
  getDocumentFile,
  deleteDocument,
  getDocumentReadiness,
};
