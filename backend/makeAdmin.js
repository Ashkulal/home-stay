const pool = require("./config/db");

async function makeAdmin() {
  const email = "admin@ibbani.com";
  try {
    const result = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, name, email, role",
      [email]
    );
    if (result.rows.length === 0) {
      console.log("User not found");
    } else {
      console.log("Admin created:", result.rows[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

makeAdmin();
