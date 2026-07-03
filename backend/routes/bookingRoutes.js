const express = require("express");
const router = express.Router();

const {
    getBookings,
    getBooking,
    createBooking,
    cancelBooking
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getBookings);
router.get("/:id", auth, getBooking);
router.post("/", auth, createBooking);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;
