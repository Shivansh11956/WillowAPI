const nodemailer = require('nodemailer');

// OTP generator
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates Brevo SMTP transporter
 * Why Brevo: More reliable than Gmail SMTP for production apps
 * Why not Gmail: Requires app passwords, has stricter rate limits
 */
const createTransporter = () => {
  // Validate required Brevo environment variables
  if (!process.env.BREVO_SMTP_HOST || !process.env.BREVO_SMTP_PORT || 
      !process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    throw new Error('Missing Brevo SMTP configuration');
  }

  return nodemailer.createTransporter({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS
    },
    timeout: 30000
  });
};

const sendOtpEmail = async (email, otp) => {
  console.log(`📧 Attempting to send OTP to: ${email}`);
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: 'Willow <no-reply@brevo.com>', // Safe sender address
      to: email,
      subject: 'Your Willow OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Willow Verification Code</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This code expires in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully to ${email}:`, {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error(`❌ Email send failed for ${email}:`, error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = { sendOtpEmail, generateOtp };