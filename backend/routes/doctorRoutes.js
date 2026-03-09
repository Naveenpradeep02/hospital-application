const express = require("express");
const router = express.Router();

const {
  createDoctor,
  getDoctors,
  updateDoctor,
  toggleDoctorStatus,
} = require("../controllers/doctorController");

router.post("/", createDoctor);
router.get("/", getDoctors);
router.put("/:id", updateDoctor);
router.patch("/:id/status", toggleDoctorStatus);

module.exports = router;
