const express = require("express");
const router = express.Router();

const { getProfile, createProfile, updateProfile } = require("../controller/student.controller");
const { profileValidationRules, validate } = require("../validators/student.validator");


const { authenticate, authorize } = require("../middlewares/auth.middleware");



router.use(authenticate);
router.use(authorize("student"));

router.get("/profile", getProfile);

router.post("/profile", profileValidationRules, validate, createProfile);


router.patch("/profile", profileValidationRules, validate, updateProfile);

module.exports = router;
