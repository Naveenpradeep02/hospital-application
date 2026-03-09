import { useEffect, useState } from "react";
import API from "../services/api";

function DoctorCard() {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState(0);
  const [patients, setPatients] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await API.get("/doctors");
        const appointmentRes = await API.get("/appointments");
        const patientRes = await API.get("/patients");

        // take first doctor for card
        setDoctor(doctorRes.data[0]);

        setAppointments(appointmentRes.data.length);
        setPatients(patientRes.data.length);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6 text-center">
      <img
        src="profile.jpg"
        className="w-24 h-24 rounded-full mx-auto"
        alt="Doctor"
      />

      <h3 className="mt-3 font-bold">{doctor?.name || "Doctor Name"}</h3>

      <p className="text-gray-500">{doctor?.specialization || "Specialist"}</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="font-bold">{appointments}</h4>
          <p className="text-sm text-gray-500">Appointments</p>
        </div>

        <div>
          <h4 className="font-bold">{patients}</h4>
          <p className="text-sm text-gray-500">Patients</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
