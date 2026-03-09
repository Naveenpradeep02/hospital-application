import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import AppointmentList from "../components/AppointmentList";
import DoctorCard from "../components/DoctorCard";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    consultations: 0,
  });

  const loadStats = async () => {
    const res = await API.get("/dashboard/stats");

    setStats(res.data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6 grid grid-cols-3 gap-6">
          <StatsCard title="Appointments" value={stats.appointments} />

          <StatsCard title="Patients" value={stats.patients} />

          <StatsCard title="Consultations" value={stats.consultations} />
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AppointmentList />
          </div>

          <DoctorCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
