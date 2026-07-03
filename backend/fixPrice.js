const pool = require("./config/db");

async function fix() {
    await pool.query("UPDATE homestays SET price_per_night = 1500");
    console.log("Updated price_per_night to 1500");
    await pool.end();
}

fix();
