const pool = require("./config/db");

async function migrate() {
    try {
        // Check if total_amount column exists
        const colCheck = await pool.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'bookings' AND column_name = 'total_amount'
        `);

        if (colCheck.rows.length === 0) {
            await pool.query(`ALTER TABLE bookings ADD COLUMN total_amount DECIMAL(10,2)`);
            console.log("Added total_amount column");
        }

        // Get all bookings and update total_amount
        const bookings = await pool.query(`SELECT id, check_in, check_out, guests FROM bookings`);

        for (const b of bookings.rows) {
            const nights = Math.max(1, Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24)));
            const total = nights * (b.guests || 1) * 1500;
            await pool.query(`UPDATE bookings SET total_amount = $1 WHERE id = $2`, [total, b.id]);
        }

        console.log(`Updated ${bookings.rows.length} bookings with total_amount`);
    } catch (err) {
        console.error("Migration error:", err.message);
    } finally {
        await pool.end();
    }
}

migrate();
