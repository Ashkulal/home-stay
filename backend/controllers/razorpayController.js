const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || ""
});

exports.createOrder = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables."
            });
        }

        const { booking_id, amount } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({ success: false, message: "booking_id and amount are required" });
        }

        // Verify booking belongs to user
        const booking = await pool.query(
            "SELECT id, total_amount FROM bookings WHERE id = $1 AND user_id = $2",
            [booking_id, req.user.id]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(parseFloat(amount) * 100), // paise
            currency: "INR",
            receipt: `booking_${booking_id}`,
            notes: { booking_id: String(booking_id) }
        });

        // Save order in payments table
        await pool.query(
            `INSERT INTO payments (booking_id, user_id, amount, upi_id, transaction_id, status)
             VALUES ($1, $2, $3, $4, $4, 'pending')
             ON CONFLICT DO NOTHING`,
            [booking_id, req.user.id, parseFloat(amount), order.id]
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
            return res.status(400).json({ success: false, message: "Missing payment verification data" });
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

        // Update payment status
        const paymentResult = await client.query(
            `UPDATE payments SET status = 'confirmed', transaction_id = $1
             WHERE booking_id = $2 AND user_id = $3
             RETURNING *`,
            [razorpay_payment_id, booking_id, req.user.id]
        );

        if (paymentResult.rows.length > 0) {
            // Confirm booking
            await client.query(
                "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
                [booking_id]
            );
        }

        await client.query("COMMIT");

        // Send confirmation email
        const { sendPaymentStatus } = require("../utils/email");
        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length > 0 && paymentResult.rows.length > 0) {
            sendPaymentStatus(user.rows[0].email, user.rows[0].name, paymentResult.rows[0], "confirmed");
        }

        res.json({
            success: true,
            message: "Payment verified and confirmed",
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Payment verify error:", err);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    } finally {
        client.release();
    }
};

exports.getKey = async (req, res) => {
    res.json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID || "",
        configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
    });
};
