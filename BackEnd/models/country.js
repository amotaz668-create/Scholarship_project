const mongoose = require("mongoose")

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    }
})

module.exports = mongoose.model("country", countrySchema)