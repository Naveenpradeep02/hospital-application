const pool = require("../config/db");

/* CREATE DOCTOR */

exports.createDoctor = async (req, res) => {
  const { name, specialization, phone, email, consultation_fee } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO doctors
      (name,specialization,phone,email,consultation_fee,active)
      VALUES($1,$2,$3,$4,$5,true)
      RETURNING *`,
      [name, specialization, phone, email, consultation_fee],
    );

    res.json({
      message: "Doctor created",
      doctor: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET DOCTORS */

exports.getDoctors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM doctors ORDER BY id DESC");

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE DOCTOR */

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;

  const { name, specialization, phone, email, consultation_fee } = req.body;

  try {
    const result = await pool.query(
      `UPDATE doctors
       SET name=$1,
       specialization=$2,
       phone=$3,
       email=$4,
       consultation_fee=$5
       WHERE id=$6
       RETURNING *`,
      [name, specialization, phone, email, consultation_fee, id],
    );

    res.json({
      message: "Doctor updated",
      doctor: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* TOGGLE ACTIVE STATUS */

exports.toggleDoctorStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await pool.query("SELECT active FROM doctors WHERE id=$1", [
      id,
    ]);

    const currentStatus = doctor.rows[0].active;

    const result = await pool.query(
      "UPDATE doctors SET active=$1 WHERE id=$2 RETURNING *",
      [!currentStatus, id],
    );

    res.json({
      message: "Doctor status updated",
      doctor: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
