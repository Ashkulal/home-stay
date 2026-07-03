const pool = require("./config/db");

const sql = `
ALTER TABLE homestays ADD COLUMN IF NOT EXISTS location_url TEXT;
ALTER TABLE homestays ADD COLUMN IF NOT EXISTS check_in_time VARCHAR(10) DEFAULT '12:00';
ALTER TABLE homestays ADD COLUMN IF NOT EXISTS check_out_time VARCHAR(10) DEFAULT '11:00';
ALTER TABLE homestays ADD COLUMN IF NOT EXISTS amenities TEXT;
`;

pool.query(sql)
  .then(() => { console.log("Columns added successfully"); process.exit(0); })
  .catch(e => { console.error("Error:", e.message); process.exit(1); });
