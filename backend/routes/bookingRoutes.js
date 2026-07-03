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

// Protected Routes - all booking access requires authentication
router.get("/", auth, getBookings);
router.get("/:id", auth, getBooking);
router.post("/", auth, createBooking);
router.put("/:id", auth, updateBooking);
router.delete("/:id", auth, deleteBooking);

module.exports = router;
