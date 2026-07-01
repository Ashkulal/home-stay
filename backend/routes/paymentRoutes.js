const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getPaymentInfo,
    initiatePayment,
    getMyPayments,
    updatePaymentProof,
    confirmPayment,
    getAllPayments
} = require("../controllers/paymentController");

// Public
router.get("/info", getPaymentInfo);

// Authenticated
router.post("/", auth, initiatePayment);
router.get("/my", auth, getMyPayments);
router.put("/:id/proof", auth, updatePaymentProof);

// Admin
router.get("/all", auth, admin, getAllPayments);
router.put("/:id/confirm", auth, admin, confirmPayment);

module.exports = router;
