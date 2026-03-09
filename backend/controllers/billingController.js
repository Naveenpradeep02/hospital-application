const pool = require("../config/db");

/* CREATE BILL */

exports.createBill = async (req, res) => {
  const { appointment_id, payment_mode, items } = req.body;

  if (!appointment_id || !items || items.length === 0) {
    return res.status(400).json({
      error: "Missing required billing data",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let subtotal = 0;

    items.forEach((item) => {
      subtotal += Number(item.amount || 0);
    });

    let tax = 0;

    if (payment_mode === "card") {
      tax = subtotal * 0.02;
    }

    const total = subtotal + tax;

    const billResult = await client.query(
      `
      INSERT INTO bills
      (appointment_id, subtotal, tax, total, payment_mode)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [appointment_id, subtotal, tax, total, payment_mode],
    );

    const billId = billResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `
        INSERT INTO bill_items
        (bill_id,item_name,item_type,amount)
        VALUES ($1,$2,$3,$4)
        `,
        [billId, item.name, item.type || "service", item.amount],
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Bill created successfully",
      bill: billResult.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Billing Error:", err);

    res.status(500).json({
      error: "Failed to create bill",
      details: err.message,
    });
  } finally {
    client.release();
  }
};

/* GET ALL BILLS */

exports.getBills = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        p.name AS patient,
        d.name AS doctor,
        b.total,
        b.payment_mode,
        b.created_at
      FROM bills b
      JOIN appointments a ON b.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY b.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Bills Error:", err);

    res.status(500).json({
      error: "Failed to fetch bills",
    });
  }
};

/* GET BILL DETAILS */

exports.getBillDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const bill = await pool.query(
      `
      SELECT
        b.*,
        p.name AS patient,
        p.phone,
        d.name AS doctor
      FROM bills b
      JOIN appointments a ON b.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE b.id=$1
      `,
      [id],
    );

    const items = await pool.query(
      `
      SELECT *
      FROM bill_items
      WHERE bill_id=$1
      `,
      [id],
    );

    res.json({
      bill: bill.rows[0],
      items: items.rows,
    });
  } catch (err) {
    console.error("Bill Details Error:", err);

    res.status(500).json({
      error: "Failed to fetch bill details",
    });
  }
};

/* UPDATE BILL (EDIT BILL) */

exports.updateBill = async (req, res) => {
  const { id } = req.params;
  const { payment_mode, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      error: "Bill items required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let subtotal = 0;

    items.forEach((item) => {
      subtotal += Number(item.amount || 0);
    });

    let tax = 0;

    if (payment_mode === "card") {
      tax = subtotal * 0.02;
    }

    const total = subtotal + tax;

    /* UPDATE BILL */

    await client.query(
      `
      UPDATE bills
      SET subtotal=$1,
          tax=$2,
          total=$3,
          payment_mode=$4
      WHERE id=$5
      `,
      [subtotal, tax, total, payment_mode, id],
    );

    /* DELETE OLD ITEMS */

    await client.query(
      `
      DELETE FROM bill_items
      WHERE bill_id=$1
      `,
      [id],
    );

    /* INSERT NEW ITEMS */

    for (const item of items) {
      await client.query(
        `
        INSERT INTO bill_items
        (bill_id,item_name,item_type,amount)
        VALUES ($1,$2,$3,$4)
        `,
        [id, item.name, item.type || "service", item.amount],
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Bill updated successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Update Bill Error:", err);

    res.status(500).json({
      error: "Failed to update bill",
    });
  } finally {
    client.release();
  }
};

/* DELETE BILL (OPTIONAL) */

exports.deleteBill = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM bill_items WHERE bill_id=$1`, [id]);

    await pool.query(`DELETE FROM bills WHERE id=$1`, [id]);

    res.json({
      message: "Bill deleted successfully",
    });
  } catch (err) {
    console.error("Delete Bill Error:", err);

    res.status(500).json({
      error: "Failed to delete bill",
    });
  }
};
