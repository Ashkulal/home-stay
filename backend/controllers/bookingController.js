const pool = require("../config/db");
const { sendBookingConfirmation } = require("../utils/email");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(str) {
    return DATE_REGEX.test(str) && !isNaN(Date.parse(str));
}

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
            message: "Failed to fetch bookings"
        });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid booking ID" });
        }

        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             WHERE b.id = $1`,
            [id]
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
            message: "Failed to fetch booking"
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

        const homestayIdInt = parseInt(homestay_id, 10);
        const guestsInt = parseInt(guests, 10);

        if (isNaN(homestayIdInt) || homestayIdInt <= 0) {
            return res.status(400).json({ success: false, message: "Invalid homestay ID" });
        }

        if (isNaN(guestsInt) || guestsInt <= 0 || guestsInt > 50) {
            return res.status(400).json({ success: false, message: "Guests must be 1-50" });
        }

        if (!isValidDate(check_in) || !isValidDate(check_out)) {
            return res.status(400).json({ success: false, message: "Invalid date format (YYYY-MM-DD)" });
        }

        if (new Date(check_out) <= new Date(check_in)) {
            return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
        }

        const homestay = await pool.query(
            "SELECT id, max_guests FROM homestays WHERE id = $1",
            [homestayIdInt]
        );

        if (homestay.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Homestay not found"
            });
        }

        if (homestay.rows[0].max_guests && guestsInt > homestay.rows[0].max_guests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${homestay.rows[0].max_guests} guests allowed`
            });
        }

        const result = await pool.query(
            `INSERT INTO bookings (user_id, homestay_id, check_in, check_out, guests)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, homestayIdInt, check_in, check_out, guestsInt]
        );

        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [req.user.id]);
        const homestayName = await pool.query("SELECT name FROM homestays WHERE id = $1", [homestayIdInt]);
        sendBookingConfirmation(
            user.rows[0].email,
            user.rows[0].name,
            { homestay_name: homestayName.rows[0].name, check_in, check_out, guests: guestsInt }
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
            message: "Failed to create booking"
        });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { check_in, check_out, guests } = req.body;

        if (guests !== undefined) {
            const guestsInt = parseInt(guests, 10);
            if (isNaN(guestsInt) || guestsInt <= 0 || guestsInt > 50) {
                return res.status(400).json({ success: false, message: "Guests must be 1-50" });
            }
        }

        if (check_in && !isValidDate(check_in)) {
            return res.status(400).json({ success: false, message: "Invalid check-in date" });
        }

        if (check_out && !isValidDate(check_out)) {
            return res.status(400).json({ success: false, message: "Invalid check-out date" });
        }

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
            message: "Failed to update booking"
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
            message: "Failed to delete booking"
        });
    }
};
