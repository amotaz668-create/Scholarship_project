const University = require("../models/university");
const { universityValidator, universityUpdateValidator } = require("../validators/university_validator");
const mongoose = require("mongoose");

const getUniversities = async (req, res) => {
    try {
        const universities = await University.find();
        res.status(200).json({ data: universities });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUniversity = async (req, res) => {
    try {
        const { error, value } = universityValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const university = await University.create(value);
        res.status(201).json({ message: "University created successfully", data: university });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUniversityById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid university ID" });
        }
        const university = await University.findById(req.params.id);
        if (!university) return res.status(404).json({ message: "University not found" });
        res.status(200).json({ data: university });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUniversity = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid university ID" });
        }
        const { error, value } = universityUpdateValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const university = await University.findByIdAndUpdate(req.params.id, value, {
            new: true,
            runValidators: true
        });

        if (!university) return res.status(404).json({ message: "University not found" });

        res.status(200).json({ message: "University updated successfully", data: university });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUniversity = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid university ID" });
        }
        const university = await University.findByIdAndDelete(req.params.id);

        if (!university) return res.status(404).json({ message: "University not found" });

        res.status(200).json({ message: "University deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUniversities,
    createUniversity,
    getUniversityById,
    updateUniversity,
    deleteUniversity
};