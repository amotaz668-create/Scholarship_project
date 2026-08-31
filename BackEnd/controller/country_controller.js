const Country = require("../models/country");
const { countryValidator, countryUpdateValidator } = require("../validators/country_validator");
const mongoose = require("mongoose");

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json({ data: countries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCountry = async (req, res) => {
    try {
        const { error, value } = countryValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const country = await Country.create(value);
        res.status(201).json({ message: "Country created successfully", data: country });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Country name or code already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

const getCountryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid country ID" });
        }
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ message: "Country not found" });
        res.status(200).json({ data: country });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCountry = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid country ID" });
        }
        const { error, value } = countryUpdateValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const country = await Country.findByIdAndUpdate(req.params.id, value, {
            new: true,
            runValidators: true
        });

        if (!country) return res.status(404).json({ message: "Country not found" });

        res.status(200).json({ message: "Country updated successfully", data: country });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Country name or code already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteCountry = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid country ID" });
        }
        const country = await Country.findByIdAndDelete(req.params.id);

        if (!country) return res.status(404).json({ message: "Country not found" });

        res.status(200).json({ message: "Country deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCountries,
    createCountry,
    getCountryById,
    updateCountry,
    deleteCountry
};