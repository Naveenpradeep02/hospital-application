const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/mailer");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // expiry (5 minutes)
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query("UPDATE admins SET otp=$1, otp_expiry=$2 WHERE email=$3", [
      otp,
      expiry,
      email,
    ]);

    // send email
    try {
      await sendOTP(email, otp);
    } catch (err) {
      res.status(500).json(err.message);
    }

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp_expiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query("UPDATE admins SET otp=$1, otp_expiry=$2 WHERE email=$3", [
      otp,
      expiry,
      email,
    ]);

    try {
      await sendOTP(email, otp);
    } catch (mailErr) {
      console.error("Email error:", mailErr);
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if admin already exists
    const existing = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert admin
    const result = await pool.query(
      "INSERT INTO admins(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashedPassword],
    );

    res.json({
      message: "Admin created successfully",
      admin: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
