const documentService = require("../services/document.service");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, message: "Document type is required." });
    }

    const doc = await documentService.uploadDocument(req.user._id, req.file, type);
    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getDocuments = async (req, res) => {
  try {
    const docs = await documentService.getDocumentsByStudent(req.user._id);
    res.status(200).json({
      success: true,
      count: docs.length,
      data: docs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getDocumentById = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id, req.user);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

const viewDocument = async (req, res) => {
  try {
    const { document, filePath } = await documentService.getDocumentFile(req.params.id, req.user);
    res.type(document.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(document.fileName)}`);
    res.sendFile(filePath);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const result = await documentService.deleteDocument(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    const status = error.statusCode || (error.message === "Unauthorized." ? 403
      : error.message === "Document not found." ? 404 : 500);
    res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = { uploadDocument, getDocuments, getDocumentById, viewDocument, deleteDocument };
