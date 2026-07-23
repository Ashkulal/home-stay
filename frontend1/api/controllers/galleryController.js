const Gallery = require("../models/Gallery");

exports.getGalleryImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json({ success: true, images });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.getGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }
        res.json({ success: true, image });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { title, image_url } = req.body;
        if (!title || !image_url) {
            return res.status(400).json({ success: false, message: "title and image_url are required" });
        }
        const image = await Gallery.create({ title, image_url });
        res.status(201).json({ success: true, message: "Image uploaded successfully", image });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }
        res.json({ success: true, message: "Image deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};
