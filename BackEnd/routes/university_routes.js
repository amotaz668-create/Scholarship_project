const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
    getUniversities,
    createUniversity,
    getUniversityById,
    updateUniversity,
    deleteUniversity
} = require("../controller/university_controller");

router.get("/", getUniversities);
router.post("/", authenticate, authorize("employee", "admin"), createUniversity);
router.get("/:id", getUniversityById);
router.patch("/:id", authenticate, authorize("employee", "admin"), updateUniversity);
router.delete("/:id", authenticate, authorize("employee", "admin"), deleteUniversity);

module.exports = router;