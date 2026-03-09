import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function BookAppointment() {
  const [step, setStep] = useState(1);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");

  /* NEW PATIENT */

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "", // ✅ added
    address: "",
  });

  /* APPOINTMENT DATA */

  const [data, setData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  const loadPatients = async () => {
    const res = await API.get("/patients");
    setPatients(res.data);
  };

  const loadDoctors = async () => {
    const res = await API.get("/doctors");
    setDoctors(res.data);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* CREATE PATIENT */

  const createPatient = async () => {
    if (!newPatient.name || !newPatient.phone || !newPatient.email) {
      alert("Name, Phone and Email required");
      return;
    }

    const res = await API.post("/patients", newPatient);

    setData((prev) => ({
      ...prev,
      patient_id: res.data.patient.id,
    }));

    alert("Patient Created");

    setStep(2);
  };

  /* CREATE APPOINTMENT */

  const createAppointment = async () => {
    if (
      !data.patient_id ||
      !data.doctor_id ||
      !data.appointment_date ||
      !data.appointment_time
    ) {
      alert("Please select doctor, date and time slot");
      return;
    }

    try {
      const res = await API.post("/appointments", data);

      alert("Token Number : " + res.data.appointment.token_number);

      setStep(1);
    } catch (err) {
      console.log(err.response?.data);
      alert("Appointment booking failed");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    setData((prev) => ({
      ...prev,
      appointment_date: date.toISOString().split("T")[0],
    }));
  };

  const selectSlot = (slot) => {
    setSelectedSlot(slot);

    const startTime = slot.split(" - ")[0];

    setData((prev) => ({
      ...prev,
      appointment_date: selectedDate.toISOString().split("T")[0],
      appointment_time: startTime,
    }));
  };

  const timeSlots = [
    "09:00 AM - 09:15 AM",
    "09:15 AM - 09:30 AM",
    "09:30 AM - 09:45 AM",
    "09:45 AM - 10:00 AM",
    "10:00 AM - 10:15 AM",
    "10:15 AM - 10:30 AM",
    "10:30 AM - 10:45 AM",
    "10:45 AM - 11:00 AM",
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

          {/* STEP 1 PATIENT */}

          {step === 1 && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">Search Patient</h3>

              <input
                type="text"
                placeholder="Search patient name..."
                className="border p-2 w-full rounded mb-4"
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-48 overflow-y-auto">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setData({ ...data, patient_id: p.id });
                      setStep(2);
                    }}
                    className="w-full text-left border p-3 mb-2 rounded hover:bg-indigo-50"
                  >
                    {p.name} — {p.email}
                  </button>
                ))}
              </div>

              {/* ADD PATIENT */}

              <h3 className="mt-6 font-semibold">Add New Patient</h3>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  placeholder="Name"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                />

                <input
                  placeholder="Age"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, age: e.target.value })
                  }
                />

                <select
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, gender: e.target.value })
                  }
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <input
                  placeholder="Phone"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, phone: e.target.value })
                  }
                />

                {/* EMAIL FIELD */}

                <input
                  placeholder="Email"
                  type="email"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, email: e.target.value })
                  }
                />

                <input
                  placeholder="Address"
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                />
              </div>

              <button
                onClick={createPatient}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Create Patient
              </button>
            </div>
          )}

          {/* STEP 2 DOCTOR */}

          {step === 2 && (
            <div className="bg-white p-6 shadow rounded">
              <h3 className="font-semibold mb-4">Select Doctor</h3>

              {doctors.map((d) => (
                <div
                  key={d.id}
                  className="border p-3 mb-2 flex justify-between rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-sm text-gray-500">{d.specialization}</p>
                  </div>

                  <button
                    onClick={() => {
                      setData({ ...data, doctor_id: d.id });
                      setStep(3);
                    }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 DATE & SLOT */}

          {step === 3 && (
            <div className="bg-white p-6 shadow rounded">
              <h3 className="font-semibold mb-4">
                Select Appointment Date & Time
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <Calendar onChange={handleDateChange} value={selectedDate} />

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => selectSlot(slot)}
                      className={`w-full p-2 rounded border text-left ${
                        selectedSlot === slot
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={createAppointment}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
