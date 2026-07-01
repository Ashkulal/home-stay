const express = require("express");
const router = express.Router();

const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getBookings);
router.get("/:id", getBooking);

// Protected Routes
router.post("/", auth, createBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
