const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");
const { sendPaymentStatus, sendBookingConfirmation } = require("../utils/email");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || ""
});

exports.getKey = async (req, res) => {
    res.json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID || "",
        configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
    });
};

exports.createOrder = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Online payment not configured. Please use UPI QR code."
            });
        }

        const { booking_id, amount } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({ success: false, message: "booking_id and amount are required" });
        }

        const booking = await pool.query(
            "SELECT id, total_amount FROM bookings WHERE id = $1 AND user_id = $2",
            [booking_id, req.user.id]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(parseFloat(amount) * 100),
            currency: "INR",
            receipt: `booking_${booking_id}_${Date.now()}`,
            notes: { booking_id: String(booking_id) }
        });

        // Save pending payment
        await pool.query(
            `INSERT INTO payments (booking_id, user_id, amount, upi_id, transaction_id, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             ON CONFLICT DO NOTHING`,
            [booking_id, req.user.id, parseFloat(amount), order.id, `order_${order.id}`]
        );

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error("Razorpay order error:", err);
        res.status(500).json({ success: false, message: "Failed to create payment order" });
    }
};

exports.verifyPayment = async (req, res) => {
    const client = await pool.connect();
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment data" });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        await client.query("BEGIN");

        // Auto-confirm payment
        const paymentResult = await client.query(
            `UPDATE payments SET status = 'confirmed', transaction_id = $1
             WHERE booking_id = $2 AND user_id = $3
             RETURNING *`,
            [razorpay_payment_id, booking_id, req.user.id]
        );

        // Auto-confirm booking
        if (paymentResult.rows.length > 0) {
            await client.query(
                "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
                [booking_id]
            );
        }

        await client.query("COMMIT");

        // Send confirmation email
        if (paymentResult.rows.length > 0) {
            const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [req.user.id]);
            if (user.rows.length > 0) {
                sendPaymentStatus(user.rows[0].email, user.rows[0].name, paymentResult.rows[0], "confirmed");
            }
        }

        res.json({
            success: true,
            message: "Payment confirmed automatically",
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Payment verify error:", err);
        res.status(500).json({ success: false, message: "Verification failed. Contact support." });
    } finally {
        client.release();
    }
};

// Manual payment submission (UPI QR fallback)
exports.submitManualPayment = async (req, res) => {
    try {
        const { booking_id, amount, transaction_id } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({ success: false, message: "booking_id and amount required" });
        }

        const booking = await pool.query(
            "SELECT id FROM bookings WHERE id = $1 AND user_id = $2",
            [booking_id, req.user.id]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const existing = await pool.query(
            "SELECT id FROM payments WHERE booking_id = $1 AND status = 'pending'",
            [booking_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Payment already pending for this booking" });
        }

        const upiId = process.env.UPI_ID || "paytmqr70c5mh@ptys";

        const result = await pool.query(
            `INSERT INTO payments (booking_id, user_id, amount, upi_id, transaction_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [booking_id, req.user.id, parseFloat(amount), upiId, transaction_id || null]
        );

        res.status(201).json({
            success: true,
            message: "Payment submitted. Waiting for admin confirmation.",
            payment: result.rows[0]
        });
    } catch (err) {
        console.error("Manual payment error:", err);
        res.status(500).json({ success: false, message: "Failed to submit payment" });
    }
};
