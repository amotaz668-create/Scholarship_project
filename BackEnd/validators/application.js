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
  
  // فحص المستندات (لو مبعوتة لازم تكون Array وكل عنصر فيه name و fileUrl)
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),
  body('documents.*.name')
    .optional()
    .isString()
    .withMessage('Document name must be a string'),
  body('documents.*.fileUrl')
    .optional()
    .isURL()
    .withMessage('Invalid file URL'),

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
  
  body('answers')
    .optional()
    .isArray()
    .withMessage('Answers must be an array'),

  handleValidationErrors // دي الفانكشن اللي بتجمع الأخطاء اللي كتبناها قبل كده
];



module.exports = {
  validateCreateApplication,
  validateUpdateStatus,
  validateApplicationId , 
  validateUpdateApplication
};