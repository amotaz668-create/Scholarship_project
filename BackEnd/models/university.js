const mongoose = require("mongoose")

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("university", universitySchema)