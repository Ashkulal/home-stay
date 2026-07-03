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

const WHATSAPP = "918660874196";
const BRAND = "Ibbani Homestay";

exports.sendBookingConfirmation = async (userEmail, userName, booking) => {
    try {
        if (!process.env.SMTP_USER) {
            console.log("SMTP not configured, skipping email");
            return;
        }
        await transporter.sendMail({
            from: `${BRAND} <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed - ${BRAND}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 30px; border-radius: 12px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏡 ${BRAND}</h1>
                    </div>
                    <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
                        <h2 style="color: #059669;">Booking Confirmed!</h2>
                        <p>Hi ${userName},</p>
                        <p>Your booking at <strong>${BRAND}</strong> has been confirmed. Here are the details:</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 8px 0; color: #6b7280;">Homestay</td><td style="padding: 8px 0; font-weight: bold;">${booking.homestay_name}</td></tr>
                                <tr><td style="padding: 8px 0; color: #6b7280;">Check-in</td><td style="padding: 8px 0; font-weight: bold;">${booking.check_in}</td></tr>
                                <tr><td style="padding: 8px 0; color: #6b7280;">Check-out</td><td style="padding: 8px 0; font-weight: bold;">${booking.check_out}</td></tr>
                                <tr><td style="padding: 8px 0; color: #6b7280;">Guests</td><td style="padding: 8px 0; font-weight: bold;">${booking.guests}</td></tr>
                                <tr><td style="padding: 8px 0; color: #6b7280;">Total Amount</td><td style="padding: 8px 0; font-weight: bold; color: #059669; font-size: 18px;">₹${booking.total_amount}</td></tr>
                            </table>
                        </div>
                        <p>Please complete the payment to confirm your booking.</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://wa.me/${WHATSAPP}?text=Hi, I have a booking at ${BRAND} (${booking.homestay_name}) from ${booking.check_in} to ${booking.check_out}" 
                               style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                💬 Chat on WhatsApp
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">Thank you for choosing ${BRAND}!</p>
                    </div>
                </div>
            `
        });
        console.log("Booking confirmation email sent to:", userEmail);
    } catch (err) {
        console.error("Booking email failed:", err.message);
    }
};

exports.sendPaymentStatus = async (userEmail, userName, payment, status) => {
    try {
        if (!process.env.SMTP_USER) {
            console.log("SMTP not configured, skipping email");
            return;
        }
        const isConfirmed = status === "confirmed";
        const subject = isConfirmed ? "Payment Confirmed" : "Payment Rejected";
        const bgColor = isConfirmed ? "#059669" : "#dc2626";
        const message = isConfirmed
            ? "Your payment has been confirmed. Your booking is now active!"
            : "Your payment was rejected. Please contact support or try again.";

        await transporter.sendMail({
            from: `${BRAND} <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `${subject} - ${BRAND}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: ${bgColor}; padding: 30px; border-radius: 12px; text-align: center;">
                        <h1 style="color: white; margin: 0;">${isConfirmed ? "✅" : "❌"} ${subject}</h1>
                    </div>
                    <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 12px 12px;">
                        <p>Hi ${userName},</p>
                        <p>${message}</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                            <p><strong>Amount:</strong> ₹${payment.amount}</p>
                            <p><strong>Transaction ID:</strong> ${payment.transaction_id || "N/A"}</p>
                            <p><strong>Status:</strong> <span style="color: ${bgColor}; font-weight: bold;">${status.toUpperCase()}</span></p>
                        </div>
                        ${isConfirmed ? `
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://wa.me/${WHATSAPP}?text=Hi, my payment is confirmed. Need check-in details for my booking." 
                               style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                💬 Get Check-in Details
                            </a>
                        </div>
                        ` : ""}
                        <p style="color: #6b7280; font-size: 14px;">${BRAND}</p>
                    </div>
                </div>
            `
        });
        console.log("Payment status email sent to:", userEmail);
    } catch (err) {
        console.error("Payment email failed:", err.message);
    }
};

exports.sendBookingReminder = async (userEmail, userName, booking) => {
    try {
        if (!process.env.SMTP_USER) return;
        await transporter.sendMail({
            from: `${BRAND} <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `Check-in Reminder - ${BRAND}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 30px; border-radius: 12px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏡 Check-in Reminder</h1>
                    </div>
                    <div style="padding: 30px; background: #f9fafb;">
                        <p>Hi ${userName},</p>
                        <p>Your check-in at <strong>${BRAND}</strong> is tomorrow!</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                            <p><strong>Homestay:</strong> ${booking.homestay_name}</p>
                            <p><strong>Check-in:</strong> ${booking.check_in}</p>
                            <p><strong>Check-in Time:</strong> 12:00 PM</p>
                            <p><strong>Guests:</strong> ${booking.guests}</p>
                        </div>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://wa.me/${WHATSAPP}?text=Hi, I'm arriving tomorrow for my check-in at ${BRAND}. Need any help?" 
                               style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                💬 Chat on WhatsApp
                            </a>
                        </div>
                        <p style="color: #6b7280;">See you soon! 🏔️</p>
                    </div>
                </div>
            `
        });
    } catch (err) {
        console.error("Reminder email failed:", err.message);
    }
};
