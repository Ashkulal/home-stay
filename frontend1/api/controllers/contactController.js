const ContactMessage = require("../models/ContactMessage");

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "name, email, and message are required" });
        }
        await ContactMessage.create({ name, email, phone, message });
        res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
};
