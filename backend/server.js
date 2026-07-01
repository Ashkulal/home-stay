const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { generalLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"];

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

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(generalLimiter);

// Routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/homestays", require("./routes/homestayRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/peaks", require("./routes/peakRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.get("/", (req, res) => {
    res.send("Misty Peaks Backend Running");
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
});

if (process.env.VERCEL !== "1") {
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
