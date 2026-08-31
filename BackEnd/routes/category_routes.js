const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controller/category_controller");

router.get("/", getCategories);
router.post("/", authenticate, authorize("employee", "admin"), createCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", authenticate, authorize("employee", "admin"), updateCategory);
router.delete("/:id", authenticate, authorize("employee", "admin"), deleteCategory);

module.exports = router;