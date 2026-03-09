import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AppointmentStatus() {
  const [appointments, setAppointments] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status });
      loadAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  /* SORT BY DATE → TOKEN */

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.appointment_date);
    const dateB = new Date(a.appointment_date);

    if (dateA - dateB !== 0) return dateA - dateB;

    return a.token_number - b.token_number;
  });

  /* FILTER */

  const filteredAppointments = sortedAppointments.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(a.appointment_date).toISOString().slice(0, 10) === dateFilter;

    const matchesSearch =
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.patient_email || "").toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesDate && matchesSearch;
  });

  /* SPLIT ACTIVE / COMPLETED */

  const activeAppointments = filteredAppointments.filter(
    (a) => a.status !== "completed",
  );

  const completedAppointments = filteredAppointments.filter(
    (a) => a.status === "completed",
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Appointment Status Management
          </h2>

          {/* FILTER BAR */}

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search patient or email..."
              className="border p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <input
              type="date"
              className="border p-2 rounded"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="consulting">Consulting</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => {
                setStatusFilter("all");
                setDateFilter("");
                setSearch("");
              }}
              className="bg-gray-300 px-3 rounded"
            >
              Reset
            </button>
          </div>

          {/* ACTIVE APPOINTMENTS */}

          <h3 className="text-lg font-semibold mb-2">Active Appointments</h3>

          <div className="bg-white rounded shadow overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Token</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>

              <tbody>
                {activeAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-500">
                      No active appointments
                    </td>
                  </tr>
                ) : (
                  activeAppointments.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{a.patient_name}</td>

                      <td className="p-3">{a.patient_email || "-"}</td>

                      <td className="p-3">{a.doctor_name}</td>

                      <td className="p-3">{formatDate(a.appointment_date)}</td>

                      <td className="p-3">{a.appointment_time}</td>

                      <td className="p-3">{a.token_number}</td>

                      <td className="p-3">
                        <span
                          className={
                            a.status === "cancelled"
                              ? "text-red-600 font-medium"
                              : a.status === "consulting"
                                ? "text-blue-600 font-medium"
                                : "text-yellow-600 font-medium"
                          }
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <select
                          className="border rounded p-1"
                          value={a.status}
                          onChange={(e) => updateStatus(a.id, e.target.value)}
                        >
                          <option value="waiting">Waiting</option>
                          <option value="consulting">Consulting</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* COMPLETED APPOINTMENTS */}

          <h3 className="text-lg font-semibold mb-2">Completed Appointments</h3>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Token</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {completedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No completed appointments
                    </td>
                  </tr>
                ) : (
                  completedAppointments.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="p-3">{a.patient_name}</td>

                      <td className="p-3">{a.patient_email || "-"}</td>

                      <td className="p-3">{a.doctor_name}</td>

                      <td className="p-3">{formatDate(a.appointment_date)}</td>

                      <td className="p-3">{a.appointment_time}</td>

                      <td className="p-3">{a.token_number}</td>

                      <td className="p-3 text-green-600 font-medium">
                        completed
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentStatus;
