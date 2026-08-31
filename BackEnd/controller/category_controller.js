const Category = require("../models/category");
const { categoryValidator, categoryUpdateValidator } = require("../validators/category_validator");
const mongoose = require("mongoose");

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { error, value } = categoryValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const category = await Category.create(value);
        res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ data: category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        const { error, value } = categoryUpdateValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const category = await Category.findByIdAndUpdate(req.params.id, value, {
            new: true,
            runValidators: true
        });

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};