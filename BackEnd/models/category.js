const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
},
    {
        timestamps: true
        // mongoose set the date by default , no need to start or end date
    }
);

module.exports = mongoose.model("category", categorySchema);