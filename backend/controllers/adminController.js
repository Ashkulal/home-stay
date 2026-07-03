const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {
        const [users, peaks, homestays, bookings, payments] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users"),
            pool.query("SELECT COUNT(*) FROM peaks"),
            pool.query("SELECT COUNT(*) FROM homestays"),
            pool.query("SELECT COUNT(*) FROM bookings"),
            pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'confirmed'")
        ]);

        const recentBookings = await pool.query(
            `SELECT b.*, h.name AS homestay_name, u.name AS user_name
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             JOIN users u ON b.user_id = u.id
             ORDER BY b.created_at DESC LIMIT 5`
        );

        res.json({
            success: true,
            stats: {
                totalUsers: parseInt(users.rows[0].count),
                totalPeaks: parseInt(peaks.rows[0].count),
                totalHomestays: parseInt(homestays.rows[0].count),
                totalBookings: parseInt(bookings.rows[0].count),
                totalRevenue: parseFloat(payments.rows[0].total),
                recentBookings: recentBookings.rows
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
        );
        res.json({ success: true, users: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const result = await pool.query(
            "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
            [role, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING id",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, h.name AS homestay_name, u.name AS user_name, u.email AS user_email
             FROM bookings b
             JOIN homestays h ON b.homestay_id = h.id
             JOIN users u ON b.user_id = u.id
             ORDER BY b.created_at DESC`
        );
        res.json({ success: true, bookings: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const result = await pool.query(
            "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
            [status, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.json({ success: true, booking: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};
