const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getPatientHistory,
} = require("../controllers/patientController");

router.post("/", verifyToken, createPatient);

router.get("/", verifyToken, getPatients);

router.get("/:id", verifyToken, getPatient);

router.put("/:id", verifyToken, updatePatient);

router.delete("/:id", verifyToken, deletePatient);

router.get("/:id/history", verifyToken, getPatientHistory);

module.exports = router;
