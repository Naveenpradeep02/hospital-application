const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Hospital App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    text: `Your verification OTP is: ${otp}`,
  });
};

module.exports = sendOTP;
