const mongoose = require("mongoose");
const {
    GENDER_VALUES,
    SCHOLARSHIP_STATUSES,
    APPLICATION_REQUIREMENT_TYPES,
    APPLICATION_REQUIREMENT_SOURCES,
    APPLICATION_PROFILE_FIELDS
} = require("../constants");


const scholarshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true

    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "university",
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: true
    },
    fundingType: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        min: 0

    },
    currency: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date,
        required: true
    },
    applicationUrl: {
        type: String,
        trim: true
    },
    eligibility: {
        minGPA: {
            type: Number,
            min: 0,
            max: 4
        },

        maxAge: {
            type: Number,
            min: 0,
            max: 100
        },

        eligibleCountries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "country"
            }
        ],

        eligibleFields: [
            {
                type: String,
                trim: true
            }
        ],

        eligibleDegrees: [
            {
                type: String,
                trim: true
            }
        ],

        gender: {
            type: String,
            enum: GENDER_VALUES
        }
    },
    requiredDocuments: [
        {
            type: {
                type: String,
                required: true,
                trim: true

            },
            required: {
                type: Boolean,
                default: true
            },
        }
    ],
    applicationRequirements: [
        {
            key: { type: String, required: true, trim: true },
            label: { type: String, required: true, trim: true },
            labelAr: { type: String, trim: true },
            type: { type: String, enum: APPLICATION_REQUIREMENT_TYPES, default: "text" },
            required: { type: Boolean, default: true },
            options: [{ type: String, trim: true }],
            source: { type: String, enum: APPLICATION_REQUIREMENT_SOURCES, default: "application" },
            profileField: { type: String, enum: APPLICATION_PROFILE_FIELDS }
        }
    ],
    status: {
        type: String,
        enum: SCHOLARSHIP_STATUSES,
        default: "draft"
    },
},
    {
        timestamps: true
    }


)


module.exports =
  mongoose.models.Scholarship ||
    mongoose.model("Scholarship", scholarshipSchema);
