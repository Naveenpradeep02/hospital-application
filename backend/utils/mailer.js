const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // IMPORTANT: false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hospital App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP",
      text: `Your verification OTP is: ${otp}`,
    });

    console.log("OTP email sent:", info.messageId);
  } catch (error) {
    console.error("OTP email error:", error);
    throw error;
  }
};

module.exports = sendOTP;
