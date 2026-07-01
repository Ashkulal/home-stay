const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || ""
    }
});

exports.sendBookingConfirmation = async (userEmail, userName, booking) => {
    try {
        if (!process.env.SMTP_USER) return;
        await transporter.sendMail({
            from: process.env.SMTP_FROM || "Misty Peaks <noreply@mistypeaks.com>",
            to: userEmail,
            subject: "Booking Confirmed - Misty Peaks",
            html: `
                <h2>Booking Confirmed!</h2>
                <p>Hi ${userName},</p>
                <p>Your booking has been confirmed:</p>
                <ul>
                    <li>Homestay: ${booking.homestay_name}</li>
                    <li>Check-in: ${booking.check_in}</li>
                    <li>Check-out: ${booking.check_out}</li>
                    <li>Guests: ${booking.guests}</li>
                </ul>
                <p>Thank you for choosing Misty Peaks!</p>
            `
        });
    } catch (err) {
        console.error("Email send failed:", err.message);
    }
};

exports.sendPaymentStatus = async (userEmail, userName, payment, status) => {
    try {
        if (!process.env.SMTP_USER) return;
        const subject = status === "confirmed" ? "Payment Confirmed" : "Payment Rejected";
        const message = status === "confirmed"
            ? "Your payment has been confirmed. Your booking is now active!"
            : "Your payment was rejected. Please contact support or try again.";

        await transporter.sendMail({
            from: process.env.SMTP_FROM || "Misty Peaks <noreply@mistypeaks.com>",
            to: userEmail,
            subject: `${subject} - Misty Peaks`,
            html: `
                <h2>${subject}</h2>
                <p>Hi ${userName},</p>
                <p>${message}</p>
                <ul>
                    <li>Amount: ₹${payment.amount}</li>
                    <li>Transaction ID: ${payment.transaction_id || "N/A"}</li>
                </ul>
            `
        });
    } catch (err) {
        console.error("Email send failed:", err.message);
    }
};
