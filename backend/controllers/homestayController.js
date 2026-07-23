const Homestay = require("../models/Homestay");

exports.getHomestays = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const homestays = await Homestay.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, homestays });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch homestays" });
    }
};

exports.getHomestay = async (req, res) => {
    try {
        const homestay = await Homestay.findById(req.params.id);
        if (!homestay) {
            return res.status(404).json({ success: false, message: "Homestay not found" });
        }
        res.json({ success: true, homestay });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch homestay" });
    }
};

exports.createHomestay = async (req, res) => {
    try {
        const homestay = await Homestay.create(req.body);
        res.status(201).json({ success: true, homestay });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create homestay" });
    }
};

exports.deleteHomestay = async (req, res) => {
    try {
        const homestay = await Homestay.findByIdAndDelete(req.params.id);
        if (!homestay) {
            return res.status(404).json({ success: false, message: "Homestay not found" });
        }
        res.json({ success: true, message: "Homestay deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete homestay" });
    }
};
