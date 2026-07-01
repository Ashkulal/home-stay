const express = require("express");
const router = express.Router();

const {
    getPeaks,
    getPeak,
    createPeak,
    updatePeak,
    deletePeak
} = require("../controllers/peakController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getPeaks);
router.get("/:id", getPeak);

// Admin Routes
router.post("/", auth, admin, createPeak);
router.put("/:id", auth, admin, updatePeak);
router.delete("/:id", auth, admin, deletePeak);

module.exports = router;
