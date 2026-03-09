const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // force IPv4
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS,
    user: "naveenpradeep0203@gmail.com",
    pass: "hmjuhazngsvxjoeu",
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

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendOTP;
