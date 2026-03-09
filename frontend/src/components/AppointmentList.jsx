import { useEffect, useState } from "react";
import API from "../services/api";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res = await API.get("/appointments/today");

      setAppointments(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load appointments", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();

    const interval = setInterval(loadAppointments, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-bold mb-4 text-lg">Today's Appointments</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments today</p>
      ) : (
        appointments.slice(0, 5).map((a) => (
          <div
            key={a.id}
            className="flex justify-between items-center border-b py-3 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{a.patient_name}</p>

              <p className="text-sm text-gray-500">{a.doctor_name}</p>

              <p className="text-xs text-gray-400">
                {formatDate(a.appointment_date)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm">{a.appointment_time}</p>

              <p className="text-xs text-gray-500">Token #{a.token_number}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AppointmentList;
