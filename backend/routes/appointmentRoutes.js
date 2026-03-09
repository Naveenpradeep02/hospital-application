const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createAppointment,
  getAppointments,
  updateStatus,
  getTodayAppointments,
} = require("../controllers/appointmentController");

router.post("/", verifyToken, createAppointment);

router.get("/", verifyToken, getAppointments);

router.get("/today", verifyToken, getTodayAppointments);

router.patch("/:id/status", verifyToken, updateStatus);

module.exports = router;
