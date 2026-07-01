const express = require("express");
const router = express.Router();

const {
    getHomestays,
    getHomestay,
    createHomestay,
    deleteHomestay
} = require("../controllers/homestayController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getHomestays);
router.get("/:id", getHomestay);

// Admin Routes
router.post("/", auth, admin, createHomestay);
router.delete("/:id", auth, admin, deleteHomestay);

module.exports = router;