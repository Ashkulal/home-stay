const pool = require("../config/db");

exports.getGalleryImages = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM gallery ORDER BY created_at DESC"
        );

        res.json({
            success: true,
            images: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Operation failed"
        });
    }
};

exports.getGalleryImage = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM gallery WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        res.json({
            success: true,
            image: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Operation failed"
        });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { title, image_url } = req.body;

        if (!title || !image_url) {
            return res.status(400).json({
                success: false,
                message: "title and image_url are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO gallery (title, image_url)
             VALUES ($1, $2)
             RETURNING *`,
            [title, image_url]
        );

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Operation failed"
        });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM gallery WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        res.json({
            success: true,
            message: "Image deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Operation failed"
        });
    }
};
