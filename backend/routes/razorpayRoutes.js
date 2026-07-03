const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createOrder, verifyPayment, getKey, submitManualPayment } = require("../controllers/razorpayController");

router.get("/key", getKey);
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);
router.post("/manual", auth, submitManualPayment);

module.exports = router;
