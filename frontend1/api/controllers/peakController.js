const Peak = require("../models/Peak");

exports.getPeaks = async (req, res) => {
    try {
        const { search, difficulty, sort } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        let sortOpt = { createdAt: -1 };
        if (sort === "altitude") sortOpt = { altitude_m: -1 };
        else if (sort === "name") sortOpt = { name: 1 };

        const peaks = await Peak.find(filter).sort(sortOpt);
        res.json({ success: true, peaks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.getPeak = async (req, res) => {
    try {
        const peak = await Peak.findById(req.params.id);
        if (!peak) {
            return res.status(404).json({ success: false, message: "Peak not found" });
        }
        res.json({ success: true, peak });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.createPeak = async (req, res) => {
    try {
        const peak = await Peak.create(req.body);
        res.status(201).json({ success: true, message: "Peak created", peak });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.updatePeak = async (req, res) => {
    try {
        const peak = await Peak.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!peak) {
            return res.status(404).json({ success: false, message: "Peak not found" });
        }
        res.json({ success: true, message: "Peak updated", peak });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.deletePeak = async (req, res) => {
    try {
        const peak = await Peak.findByIdAndDelete(req.params.id);
        if (!peak) {
            return res.status(404).json({ success: false, message: "Peak not found" });
        }
        res.json({ success: true, message: "Peak deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};
