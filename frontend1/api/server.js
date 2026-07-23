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

// Routes — no /api prefix since Vercel strips it
app.use("/auth", require("./routes/authRoutes"));
app.use("/homestays", require("./routes/homestayRoutes"));
app.use("/peaks", require("./routes/peakRoutes"));
app.use("/gallery", require("./routes/galleryRoutes"));
app.use("/contact", require("./routes/contactRoutes"));

app.get("/", (req, res) => {
    res.json({ success: true, message: "Silent Peak API" });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found: " + req.path });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
