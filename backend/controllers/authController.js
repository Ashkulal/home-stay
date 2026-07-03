const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 100;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (typeof name !== "string" || name.trim().length < 2 || name.length > NAME_MAX) {
            return res.status(400).json({
                success: false,
                message: "Name must be 2-100 characters"
            });
        }

        if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (typeof password !== "string" || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
            return res.status(400).json({
                success: false,
                message: "Password must be 6-128 characters"
            });
        }

        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedName = name.trim();

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [sanitizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [sanitizedName, sanitizedEmail, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        const sanitizedEmail = email.trim().toLowerCase();

        const result = await pool.query(
            "SELECT id, name, email, password, role FROM users WHERE email = $1",
            [sanitizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};
