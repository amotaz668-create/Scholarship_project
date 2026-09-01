const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  viewDocument,
  deleteDocument,
} = require("../controller/document.controller");

const { upload, handleUploadError } = require("../middlewares/upload.middleware");
const { uploadValidationRules, idParamRule, validate } = require("../validators/document.validator");


const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/auth.middleware");


router.use(authenticate);

// Authenticated file delivery performs ownership/assignment checks in the service.
router.get("/:id/file", idParamRule, validate, viewDocument);

router.use(authorize("student"));

router.get("/", getDocuments);


router.post(
  "/",
  upload.single("file"),
  handleUploadError,
  uploadValidationRules,
  validate,
  uploadDocument
);


router.get("/:id", idParamRule, validate, getDocumentById);


router.delete("/:id", idParamRule, validate, deleteDocument);

module.exports = router;
