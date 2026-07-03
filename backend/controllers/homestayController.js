const pool = require("../config/db");

// Get all homestays
exports.getHomestays = async (req, res) => {
    try {
        const { search, max_price, min_guests, sort } = req.query;
        let query = "SELECT * FROM homestays WHERE 1=1";
        const params = [];
        let idx = 1;

        if (search) {
            query += ` AND (name ILIKE $${idx} OR description ILIKE $${idx})`;
            params.push(`%${search}%`);
            idx++;
        }
        if (max_price) {
            query += ` AND price_per_night <= $${idx}`;
            params.push(max_price);
            idx++;
        }
        if (min_guests) {
            query += ` AND max_guests >= $${idx}`;
            params.push(min_guests);
            idx++;
        }
        if (sort === "price") query += ` ORDER BY price_per_night ASC`;
        else if (sort === "price_desc") query += ` ORDER BY price_per_night DESC`;
        else query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, params);
        res.json({ success: true, homestays: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch homestays" });
    }
};

// Get single homestay
exports.getHomestay = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM homestays WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Homestay not found"
            });
        }

        res.json({
            success: true,
            homestay: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch homestays"
        });
    }
};

// Create homestay
exports.createHomestay = async (req, res) => {
    try {
        const {
            name,
            description,
            price_per_night,
            max_guests,
            image_url
        } = req.body;

        if (!name || !price_per_night) {
            return res.status(400).json({
                success: false,
                message: "name and price_per_night are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO homestays
            (name, description, price_per_night, max_guests, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                name,
                description || null,
                price_per_night,
                max_guests || null,
                image_url || null
            ]
        );

        res.status(201).json({
            success: true,
            homestay: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch homestays"
        });
    }
};

// Delete homestay
exports.deleteHomestay = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM homestays WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Homestay not found"
            });
        }

        res.json({
            success: true,
            message: "Homestay deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch homestays"
        });
    }
};