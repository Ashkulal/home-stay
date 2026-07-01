const pool = require("../config/db");
const { sendBookingConfirmation } = require("../utils/email");

exports.getBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             ORDER BY b.created_at DESC`
        );

        res.json({
            success: true,
            bookings: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             WHERE b.id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            booking: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { homestay_id, check_in, check_out, guests } = req.body;

        if (!homestay_id || !check_in || !check_out || !guests) {
            return res.status(400).json({
                success: false,
                message: "homestay_id, check_in, check_out, and guests are required"
            });
        }

        const homestay = await pool.query(
            "SELECT id, max_guests FROM homestays WHERE id = $1",
            [homestay_id]
        );

        if (homestay.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Homestay not found"
            });
        }

        if (homestay.rows[0].max_guests && guests > homestay.rows[0].max_guests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${homestay.rows[0].max_guests} guests allowed`
            });
        }

        const result = await pool.query(
            `INSERT INTO bookings (user_id, homestay_id, check_in, check_out, guests)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, homestay_id, check_in, check_out, guests]
        );

        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [req.user.id]);
        const homestayName = await pool.query("SELECT name FROM homestays WHERE id = $1", [homestay_id]);
        sendBookingConfirmation(
            user.rows[0].email,
            user.rows[0].name,
            { homestay_name: homestayName.rows[0].name, check_in, check_out, guests }
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { check_in, check_out, guests } = req.body;

        const result = await pool.query(
            `UPDATE bookings
             SET check_in = COALESCE($1, check_in),
                 check_out = COALESCE($2, check_out),
                 guests = COALESCE($3, guests)
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [check_in, check_out, guests, req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking updated successfully",
            booking: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING id",
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
