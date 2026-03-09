import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AppointmentScheduler({ setData }) {
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");

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

  const selectSlot = (slot) => {
    setSelectedSlot(slot);

    setData((prev) => ({
      ...prev,
      appointment_date: date.toISOString().split("T")[0],
      appointment_time: slot,
    }));
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Select Appointment Date</h2>

      <Calendar
        onChange={setDate}
        value={date}
        className="border rounded p-2"
      />

      <h3 className="mt-6 font-semibold">Select Time Slot</h3>

      <div className="mt-3 space-y-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => selectSlot(slot)}
            className={`w-full p-2 rounded border text-left ${
              selectedSlot === slot ? "bg-indigo-600 text-white" : "bg-gray-100"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AppointmentScheduler;
