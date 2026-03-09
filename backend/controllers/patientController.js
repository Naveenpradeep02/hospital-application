const pool = require("../config/db");

/* CREATE PATIENT */

exports.createPatient = async (req, res) => {
  const { name, age, gender, phone, email, address, reference } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO patients
      (name,age,gender,phone,email,address,reference)
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [name, age, gender, phone, email, address, reference],
    );

    res.json({
      message: "Patient created",
      patient: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL PATIENTS */

exports.getPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY id DESC");

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET SINGLE PATIENT */

exports.getPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM patients WHERE id=$1", [id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE PATIENT */

exports.updatePatient = async (req, res) => {
  const { id } = req.params;

  const { name, age, gender, phone, email, address, reference } = req.body;

  try {
    const result = await pool.query(
      `UPDATE patients
       SET name=$1,
       age=$2,
       gender=$3,
       phone=$4,
       email=$5,
       address=$6,
       reference=$7
       WHERE id=$8
       RETURNING *`,
      [name, age, gender, phone, email, address, reference, id],
    );

    res.json({
      message: "Patient updated",
      patient: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PATIENT */

exports.deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM patients WHERE id=$1", [id]);

    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* PATIENT HISTORY */

exports.getPatientHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        a.appointment_date,
        d.name AS doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
      `,
      [id],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
