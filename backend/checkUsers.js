require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await mongoose.connection.db.collection("users").find({}).toArray();
    console.log("Total users:", users.length);
    users.forEach((u, i) => {
      console.log(`${i+1}. ${u.name} | ${u.email} | role: ${u.role} | created: ${u.createdAt}`);
    });
    process.exit(0);
  })
  .catch((err) => { console.error("Error:", err.message); process.exit(1); });
