const express = require("express");
const router = express.Router();

const {
    getBookings,
    getBooking,
    createBooking,
    cancelBooking,
    getPrice
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

router.get("/price", getPrice);
router.get("/", auth, getBookings);
router.get("/:id", auth, getBooking);
router.post("/", auth, createBooking);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;
