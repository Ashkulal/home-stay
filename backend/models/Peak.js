const mongoose = require("mongoose");

const peakSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    altitude_m: Number,
    difficulty: String,
    description: String,
    image_url: String,
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Peak", peakSchema);
