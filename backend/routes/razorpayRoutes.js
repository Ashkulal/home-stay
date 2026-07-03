const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createOrder, verifyPayment, getKey } = require("../controllers/razorpayController");

router.get("/key", getKey);
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;
