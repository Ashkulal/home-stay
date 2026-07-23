const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/homestays", require("./routes/homestayRoutes"));
app.use("/api/peaks", require("./routes/peakRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.get("/api", (req, res) => {
    res.json({ success: true, message: "Silent Peak API" });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Not found" });
});

module.exports = app;
