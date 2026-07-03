const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

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
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
});

router.put("/me", auth, async (req, res) => {
    try {
        const { name, email } = req.body;

        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
                return res.status(400).json({ success: false, message: "Name must be 2-100 characters" });
            }
        }

        if (email !== undefined) {
            if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
                return res.status(400).json({ success: false, message: "Invalid email format" });
            }
        }

        const sanitizedName = name ? name.trim() : null;
        const sanitizedEmail = email ? email.trim().toLowerCase() : null;

        const result = await pool.query(
            `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email)
             WHERE id = $3 RETURNING id, name, email, role, created_at`,
            [sanitizedName, sanitizedEmail, req.user.id]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
});

router.put("/me/password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both passwords required" });
        }

        if (typeof newPassword !== "string" || newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
            return res.status(400).json({ success: false, message: "New password must be 6-128 characters" });
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
        res.status(500).json({ success: false, message: "Failed to update password" });
    }
});

module.exports = router;
