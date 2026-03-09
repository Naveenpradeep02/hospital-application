const pool = require("../config/db");

/* CREATE APPOINTMENT */

exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time } =
    req.body;

  try {
    const tokenResult = await pool.query(
      `SELECT COALESCE(MAX(token_number),0)+1 AS token
       FROM appointments
       WHERE doctor_id=$1
       AND appointment_date=$2`,
      [doctor_id, appointment_date],
    );

    const token = tokenResult.rows[0].token;

    const result = await pool.query(
      `INSERT INTO appointments
       (patient_id,doctor_id,appointment_date,appointment_time,token_number)
       VALUES($1,$2,$3,$4,$5)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time, token],
    );

    res.json({
      message: "Appointment booked",
      appointment: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL APPOINTMENTS */

exports.getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        p.name AS patient_name,
        p.email AS patient_email,
        p.phone AS patient_phone,
        d.name AS doctor_name,
        a.appointment_date,
        a.appointment_time,
        a.token_number,
        a.status

      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id

      ORDER BY a.appointment_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE STATUS */

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointments
       SET status=$1
       WHERE id=$2
       RETURNING *`,
      [status, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET TODAY APPOINTMENTS */

exports.getTodayAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        p.name AS patient_name,
        p.email AS patient_email,
        p.phone AS patient_phone,
        d.name AS doctor_name,
        a.appointment_time,
        a.token_number,
        a.status

      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id

      WHERE a.appointment_date = CURRENT_DATE

      ORDER BY a.appointment_time
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
