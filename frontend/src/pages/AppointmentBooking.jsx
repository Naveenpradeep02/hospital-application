import { useEffect, useState } from "react";
import API from "../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AppointmentBooking() {
  const [step, setStep] = useState(1);

  const [doctors, setDoctors] = useState([]);

  /* PATIENT DETAILS */

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // ✅ ADDED
  const [address, setAddress] = useState("");

  /* DOCTOR */

  const [doctor, setDoctor] = useState("");

  /* DATE + TIME */

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");

  const timeSlots = [
    "09:00 AM - 09:15 AM",
    "09:15 AM - 09:30 AM",
    "09:30 AM - 09:45 AM",
    "09:45 AM - 10:00 AM",
    "10:00 AM - 10:15 AM",
    "10:15 AM - 10:30 AM",
    "10:30 AM - 10:45 AM",
    "10:45 AM - 11:00 AM",
    "11:00 AM - 11:15 AM",
    "11:15 AM - 11:30 AM",
    "11:30 AM - 11:45 AM",
    "11:45 AM - 12:00 PM",
  ];

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* BOOK APPOINTMENT */

  const bookAppointment = async () => {
    if (!time) {
      alert("Please select time slot");
      return;
    }

    try {
      await API.post("/appointments/manual", {
        name,
        age,
        gender,
        phone,
        email, // ✅ ADDED
        address,
        doctor_id: doctor,
        appointment_date: date,
        appointment_time: time,
      });

      alert("Appointment booked successfully");

      setStep(1);
      setName("");
      setAge("");
      setGender("");
      setPhone("");
      setEmail(""); // ✅ RESET
      setAddress("");
      setDoctor("");
      setTime("");
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[950px]">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Appointment Booking
        </h2>

        {/* STEP INDICATOR */}

        <div className="flex justify-between mb-8 text-sm font-semibold">
          <div className={step >= 1 ? "text-blue-600" : "text-gray-400"}>
            1 Patient Details
          </div>

          <div className={step >= 2 ? "text-blue-600" : "text-gray-400"}>
            2 Select Doctor
          </div>

          <div className={step >= 3 ? "text-blue-600" : "text-gray-400"}>
            3 Date & Time
          </div>
        </div>

        {/* STEP 1 — PATIENT */}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Name"
              className="border p-3 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Age"
              className="border p-3 rounded-lg"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            {/* GENDER */}

            <select
              className="border p-3 rounded-lg"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* EMAIL FIELD */}

            <input
              type="email"
              placeholder="Email Address"
              className="border p-3 rounded-lg col-span-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              placeholder="Address"
              className="border p-3 rounded-lg col-span-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="col-span-2 flex justify-end">
              <button
                disabled={
                  !name || !age || !gender || !phone || !email || !address
                }
                onClick={() => setStep(2)}
                className={`px-6 py-2 rounded-lg text-white ${
                  !name || !age || !gender || !phone || !email || !address
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — DOCTOR */}

        {step === 2 && (
          <div className="space-y-4 w-[400px]">
            <select
              className="border p-3 rounded-lg w-full"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            >
              <option value="">Select Doctor</option>

              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                disabled={!doctor}
                onClick={() => setStep(3)}
                className={`px-5 py-2 rounded-lg text-white ${
                  !doctor
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — DATE TIME */}

        {step === 3 && (
          <div className="flex gap-12">
            {/* CALENDAR */}

            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Select Date</h3>

              <Calendar onChange={setDate} value={date} />
            </div>

            {/* TIME SLOTS */}

            <div className="w-[280px]">
              <h3 className="font-semibold mb-3 text-gray-700">
                Available Time
              </h3>

              <div className="h-[320px] overflow-y-auto space-y-2">
                {timeSlots.map((slot, i) => (
                  <div
                    key={i}
                    onClick={() => setTime(slot)}
                    className={`p-3 border rounded-lg cursor-pointer text-center ${
                      time === slot
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex flex-col justify-end gap-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                disabled={!time}
                onClick={bookAppointment}
                className={`px-6 py-2 rounded-lg text-white ${
                  !time
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentBooking;
