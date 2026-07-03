const pool = require("../config/db");

exports.getReviews = async (req, res) => {
    try {
        const { target_type, target_id } = req.query;
        let query = `SELECT r.*, u.name AS user_name
                     FROM reviews r
                     JOIN users u ON r.user_id = u.id`;
        const params = [];

        if (target_type && target_id) {
            query += ` WHERE r.target_type = $1 AND r.target_id = $2`;
            params.push(target_type, target_id);
        }

        query += ` ORDER BY r.created_at DESC`;
        const result = await pool.query(query, params);

        res.json({ success: true, reviews: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { target_type, target_id, rating, comment } = req.body;

        if (!target_type || !target_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "target_type, target_id, and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const existing = await pool.query(
            "SELECT id FROM reviews WHERE user_id = $1 AND target_type = $2 AND target_id = $3",
            [req.user.id, target_type, target_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this"
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews (user_id, target_type, target_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, target_type, target_id, rating, comment || null]
        );

        res.status(201).json({
            success: true,
            message: "Review created",
            review: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id",
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Operation failed" });
    }
};
