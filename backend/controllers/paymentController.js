const pool = require("../config/db");
const { sendPaymentStatus } = require("../utils/email");

exports.getPaymentInfo = async (req, res) => {
    try {
        const upiId = process.env.UPI_ID || "misty-peaks@upi";
        const qrCodeUrl = process.env.UPI_QR_URL || "";

        res.json({
            success: true,
            upiId,
            qrCodeUrl,
            instructions: "Scan the QR code or use the UPI ID to make payment. Then upload your transaction ID as proof."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.initiatePayment = async (req, res) => {
    try {
        const { booking_id, amount, transaction_id, proof_url } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({
                success: false,
                message: "booking_id and amount are required"
            });
        }

        const booking = await pool.query(
            "SELECT id FROM bookings WHERE id = $1 AND user_id = $2",
            [booking_id, req.user.id]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const existing = await pool.query(
            "SELECT id FROM payments WHERE booking_id = $1 AND status = 'pending'",
            [booking_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Payment already pending for this booking"
            });
        }

        const upiId = process.env.UPI_ID || "misty-peaks@upi";

        const result = await pool.query(
            `INSERT INTO payments (booking_id, user_id, amount, upi_id, transaction_id, proof_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [booking_id, req.user.id, amount, upiId, transaction_id || null, proof_url || null]
        );

        res.status(201).json({
            success: true,
            message: "Payment initiated",
            payment: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, b.check_in, b.check_out, h.name AS homestay_name
             FROM payments p
             JOIN bookings b ON p.booking_id = b.id
             JOIN homestays h ON b.homestay_id = h.id
             WHERE p.user_id = $1
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, payments: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updatePaymentProof = async (req, res) => {
    try {
        const { transaction_id, proof_url } = req.body;

        const result = await pool.query(
            `UPDATE payments
             SET transaction_id = COALESCE($1, transaction_id),
                 proof_url = COALESCE($2, proof_url)
             WHERE id = $3 AND user_id = $4
             RETURNING *`,
            [transaction_id, proof_url, req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        res.json({ success: true, payment: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["confirmed", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be 'confirmed' or 'rejected'" });
        }

        const result = await pool.query(
            "UPDATE payments SET status = $1 WHERE id = $2 RETURNING *",
            [status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (status === "confirmed") {
            await pool.query(
                "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
                [result.rows[0].booking_id]
            );
        }

        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [result.rows[0].user_id]);
        if (user.rows.length > 0) {
            sendPaymentStatus(user.rows[0].email, user.rows[0].name, result.rows[0], status);
        }

        res.json({ success: true, payment: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, u.name AS user_name, u.email AS user_email,
                    h.name AS homestay_name
             FROM payments p
             JOIN users u ON p.user_id = u.id
             JOIN bookings b ON p.booking_id = b.id
             JOIN homestays h ON b.homestay_id = h.id
             ORDER BY p.created_at DESC`
        );
        res.json({ success: true, payments: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
