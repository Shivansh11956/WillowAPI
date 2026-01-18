const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`SMTP not configured. OTP for ${email}: ${otp}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,          // MUST be false for 587
      requireTLS: true,       // IMPORTANT for Brevo
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // 🔍 Verify SMTP connection
    await transporter.verify();
    console.log("Brevo SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Willow API" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "Your Login OTP - Content Moderation API",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Content Moderation API</h2>
          <p>Your OTP code is:</p>
          <h1 style="background: #f3f4f6; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 32px;">
            ${otp}
          </h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = { sendOTPEmail };
