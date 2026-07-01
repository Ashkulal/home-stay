const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/me", auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email)
             WHERE id = $3 RETURNING id, name, email, role, created_at`,
            [name, email, req.user.id]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/me/password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both passwords required" });
        }

        const user = await pool.query("SELECT password FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const valid = await bcrypt.compare(currentPassword, user.rows[0].password);

        if (!valid) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, req.user.id]);

        res.json({ success: true, message: "Password updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
