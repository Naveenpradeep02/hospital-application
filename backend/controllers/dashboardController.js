const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const patients = await pool.query("SELECT COUNT(*) FROM patients");

    const appointments = await pool.query("SELECT COUNT(*) FROM appointments");

    const consultations = await pool.query("SELECT COUNT(*) FROM bills");

    res.json({
      patients: Number(patients.rows[0].count),
      appointments: Number(appointments.rows[0].count),
      consultations: Number(consultations.rows[0].count),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
};
