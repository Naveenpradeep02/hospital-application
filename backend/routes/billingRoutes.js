const express = require("express");
const router = express.Router();

const {
  createBill,
  getBills,
  getBillDetails,
  updateBill,
  deleteBill,
} = require("../controllers/billingController");

router.post("/", createBill);

router.get("/", getBills);

router.get("/:id", getBillDetails);

router.put("/:id", updateBill);

router.delete("/:id", deleteBill);

module.exports = router;
