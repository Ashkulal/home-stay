const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    image_url: { type: String, required: true },
    category: { type: String, default: "Homestay" },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
