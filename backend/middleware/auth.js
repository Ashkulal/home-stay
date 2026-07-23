const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer")
            ? req.headers.authorization.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "silentpeak_secret_2026");
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = auth;
