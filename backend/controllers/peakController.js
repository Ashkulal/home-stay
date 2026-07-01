const pool = require("../config/db");

exports.getPeaks = async (req, res) => {
    try {
        const { search, difficulty, sort } = req.query;
        let query = `SELECT id, name, location, altitude_m, difficulty, description, image_url, is_active, created_at FROM peaks WHERE 1=1`;
        const params = [];
        let idx = 1;

        if (search) {
            query += ` AND (name ILIKE $${idx} OR location ILIKE $${idx})`;
            params.push(`%${search}%`);
            idx++;
        }
        if (difficulty) {
            query += ` AND difficulty = $${idx}`;
            params.push(difficulty);
            idx++;
        }
        if (sort === "altitude") query += ` ORDER BY altitude_m DESC`;
        else if (sort === "name") query += ` ORDER BY name ASC`;
        else query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, params);
        res.json({ success: true, peaks: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getPeak = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, location, altitude_m, difficulty, description, image_url, is_active, created_at
             FROM peaks
             WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Peak not found"
            });
        }

        res.json({
            success: true,
            peak: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.createPeak = async (req, res) => {
    try {
        const { name, location, altitude_m, difficulty, description, image_url } = req.body;

        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: "Name and location are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO peaks (name, location, altitude_m, difficulty, description, image_url)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, location, altitude_m, difficulty, description, image_url, is_active, created_at`,
            [name, location, altitude_m || null, difficulty || null, description || null, image_url || null]
        );

        res.status(201).json({
            success: true,
            message: "Peak created successfully",
            peak: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updatePeak = async (req, res) => {
    try {
        const { name, location, altitude_m, difficulty, description, image_url, is_active } = req.body;

        const result = await pool.query(
            `UPDATE peaks
             SET name = COALESCE($1, name),
                 location = COALESCE($2, location),
                 altitude_m = COALESCE($3, altitude_m),
                 difficulty = COALESCE($4, difficulty),
                 description = COALESCE($5, description),
                 image_url = COALESCE($6, image_url),
                 is_active = COALESCE($7, is_active)
             WHERE id = $8
             RETURNING id, name, location, altitude_m, difficulty, description, image_url, is_active, created_at`,
            [name, location, altitude_m, difficulty, description, image_url, is_active, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Peak not found"
            });
        }

        res.json({
            success: true,
            message: "Peak updated successfully",
            peak: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.deletePeak = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM peaks WHERE id = $1 RETURNING id",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Peak not found"
            });
        }

        res.json({
            success: true,
            message: "Peak deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
