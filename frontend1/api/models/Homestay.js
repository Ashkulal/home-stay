const mongoose = require("mongoose");

const homestaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price_per_night: Number,
    max_guests: Number,
    image_url: String,
    location_url: String,
    check_in_time: { type: String, default: "12:00" },
    check_out_time: { type: String, default: "11:00" },
    amenities: String,
}, { timestamps: true });

module.exports = mongoose.model("Homestay", homestaySchema);
