const pool = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT role FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0 || result.rows[0].role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
