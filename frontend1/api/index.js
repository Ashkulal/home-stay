const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// DB
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
    } catch (err) {
        throw err;
    }
}

// Middleware
app.use(async (req, res, next) => {
    try { await connectDB(); next(); } catch { res.status(500).json({ success: false, message: "DB connection failed" }); }
});

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({ origin: (o, cb) => { if (!o || allowedOrigins.includes(o)) cb(null, true); else cb(new Error("CORS")); }, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Models
const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true }, password: { type: String, required: true, minlength: 6 }, role: { type: String, default: "user" } }, { timestamps: true });
userSchema.pre("save", async function (n) { if (!this.isModified("password")) return n(); this.password = await bcrypt.hash(this.password, 12); n(); });
userSchema.methods.comparePassword = async function (pw) { return bcrypt.compare(pw, this.password); };
const User = mongoose.model("User", userSchema);

const homestaySchema = new mongoose.Schema({ name: { type: String, required: true }, description: String, price_per_night: Number, max_guests: Number, image_url: String, location_url: String, check_in_time: { type: String, default: "12:00" }, check_out_time: { type: String, default: "11:00" }, amenities: String }, { timestamps: true });
const Homestay = mongoose.model("Homestay", homestaySchema);

const peakSchema = new mongoose.Schema({ name: { type: String, required: true }, location: { type: String, required: true }, altitude_m: Number, difficulty: String, description: String, image_url: String, is_active: { type: Boolean, default: true } }, { timestamps: true });
const Peak = mongoose.model("Peak", peakSchema);

const gallerySchema = new mongoose.Schema({ title: { type: String, required: true }, image_url: { type: String, required: true } }, { timestamps: true });
const Gallery = mongoose.model("Gallery", gallerySchema);

const contactSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, phone: String, message: { type: String, required: true } }, { timestamps: true });
const ContactMessage = mongoose.model("ContactMessage", contactSchema);

// Auth
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
    try { req.user = await User.findById(jwt.verify(token, process.env.JWT_SECRET || "secret").id).select("-password"); if (!req.user) throw new Error(); next(); } catch { res.status(401).json({ success: false, message: "Invalid token" }); }
};

// Routes
app.get("/api", (req, res) => res.json({ success: true, message: "Silent Peak API" }));

app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        if (await User.findOne({ email })) return res.status(400).json({ success: false, message: "Email already registered" });
        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ success: false, message: "Registration failed" }); }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
        res.json({ success: true, token: signToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ success: false, message: "Login failed" }); }
});

app.get("/api/auth/me", auth, async (req, res) => {
    res.json({ success: true, user: req.user });
});

app.get("/api/homestays", async (req, res) => {
    try { const homestays = await Homestay.find().sort({ createdAt: -1 }); res.json({ success: true, homestays }); } catch { res.status(500).json({ success: false, message: "Failed" }); }
});

app.get("/api/peaks", async (req, res) => {
    try { const peaks = await Peak.find().sort({ createdAt: -1 }); res.json({ success: true, peaks }); } catch { res.status(500).json({ success: false, message: "Failed" }); }
});

app.get("/api/gallery", async (req, res) => {
    try { const images = await Gallery.find().sort({ createdAt: -1 }); res.json({ success: true, images }); } catch { res.status(500).json({ success: false, message: "Failed" }); }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ success: false, message: "Name, email, and message required" });
        await ContactMessage.create({ name, email, phone, message });
        res.status(201).json({ success: true, message: "Message sent" });
    } catch { res.status(500).json({ success: false, message: "Failed" }); }
});

app.use((req, res) => { res.status(404).json({ success: false, message: "Not found" }); });

module.exports = app;
