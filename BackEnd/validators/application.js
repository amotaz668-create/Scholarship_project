const { body, param, validationResult } = require('express-validator');

// 1. ميدلوير للتعامل مع الأخطاء وتجميعها
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// 2. فحص البيانات وإحنا بنكريت طلب جديد
const validateCreateApplication = [
  body('scholarshipId')
    .isMongoId()
    .withMessage('Invalid Scholarship ID format'),
  
  // Application documents are metadata objects. The service resolves each
  // documentId against the authenticated student's wallet before saving, so
  // client-supplied file metadata is never trusted as the source of truth.
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),
  body('documents.*')
    .optional()
    .isObject()
    .withMessage('Each document must be an object'),
  body('documents.*.documentId')
    .exists()
    .withMessage('Document ID is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid document ID'),
  body('documents.*.name')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document name must be a string'),
  body('documents.*.type')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document type must be a string'),
  body('documents.*.fileName')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Document file name must be a string'),
  body('documents.*.fileUrl')
    .optional()
    .isString()
    .isLength({ max: 2048 })
    .withMessage('Document file URL must be a string'),
  body('documents.*.mimeType')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document MIME type must be a string'),

  // فحص الإجابات
  body('answers')
    .optional()
    .isArray()
    .withMessage('Answers must be an array'),
  body('answers.*.question')
    .optional()
    .isString()
    .withMessage('Question must be a string'),
  body('answers.*.answer')
    .optional()
    .isString()
    .withMessage('Answer must be a string'),

  handleValidationErrors
];

// 3. فحص البيانات لما الموظف يجي يغير حالة الطلب
const validateUpdateStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Application ID in URL'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['under_review', 'missing_documents', 'accepted', 'rejected'])
    .withMessage('Invalid status value. Allowed values: under_review, missing_documents, accepted, rejected'),
  
  body('note')
    .optional()
    .isString()
    .withMessage('Note must be a text string'),

  handleValidationErrors
];

// 4. فحص أي Route بياخد ID في الرابط (زي جلب طلب معين)
const validateApplicationId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Application ID'),
  
  handleValidationErrors
];


// فحص تحديث الطلب (التعديلات اختيارية)
const validateUpdateApplication = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Application ID'),
  
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),

  body('documents.*')
    .optional()
    .isObject()
    .withMessage('Each document must be an object'),

  body('documents.*.documentId')
    .exists()
    .withMessage('Document ID is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid document ID'),

  body('documents.*.name')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document name must be a string'),

  body('documents.*.type')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document type must be a string'),

  body('documents.*.fileName')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Document file name must be a string'),

  body('documents.*.fileUrl')
    .optional()
    .isString()
    .isLength({ max: 2048 })
    .withMessage('Document file URL must be a string'),

  body('documents.*.mimeType')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Document MIME type must be a string'),
  
  body('answers')
    .optional()
    .isArray()
    .withMessage('Answers must be an array'),

  body('answers.*.requirementKey')
    .optional()
    .isString()
    .withMessage('Requirement key must be a string'),

  body('profileData')
    .optional()
    .isObject()
    .withMessage('Profile data must be an object'),

  body('documentIds')
    .optional()
    .isArray()
    .withMessage('Document IDs must be an array'),

  body('documentIds.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid document ID'),

  body('saveProfile')
    .optional()
    .isBoolean()
    .withMessage('saveProfile must be a boolean'),

  handleValidationErrors // دي الفانكشن اللي بتجمع الأخطاء اللي كتبناها قبل كده
];



module.exports = {
  validateCreateApplication,
  validateUpdateStatus,
  validateApplicationId , 
  validateUpdateApplication
};
