const pool = require("../config/db");
const { sendBookingConfirmation } = require("../utils/email");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(str) {
    return DATE_REGEX.test(str) && !isNaN(Date.parse(str));
}

exports.getBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name, h.price_per_night
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            [req.user.id]
        );

        res.json({ success: true, bookings: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name, h.price_per_night
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             WHERE b.id = $1 AND b.user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, booking: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch booking" });
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
            "SELECT id, max_guests, price_per_night, name FROM homestays WHERE id = $1",
            [homestayIdInt]
        );

        if (homestay.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Homestay not found" });
        }

        if (homestay.rows[0].max_guests && guestsInt > homestay.rows[0].max_guests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${homestay.rows[0].max_guests} guests allowed`
            });
        }

        // Calculate total amount: nights × price_per_night
        const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
        const pricePerNight = parseFloat(homestay.rows[0].price_per_night) || 0;
        const totalAmount = nights * pricePerNight;

        const result = await pool.query(
            `INSERT INTO bookings (user_id, homestay_id, check_in, check_out, guests, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [req.user.id, homestayIdInt, check_in, check_out, guestsInt, totalAmount]
        );

        const user = await pool.query("SELECT name, email FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length > 0) {
            sendBookingConfirmation(
                user.rows[0].email,
                user.rows[0].name,
                { homestay_name: homestay.rows[0].name, check_in, check_out, guests: guestsInt, total_amount: totalAmount }
            );
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: { ...result.rows[0], total_amount: totalAmount, nights, homestay_name: homestay.rows[0].name }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create booking" });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE bookings SET status = 'cancelled'
             WHERE id = $1 AND user_id = $2 AND status = 'pending'
             RETURNING *`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found or cannot be cancelled" });
        }

        res.json({ success: true, message: "Booking cancelled" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to cancel booking" });
    }
};
