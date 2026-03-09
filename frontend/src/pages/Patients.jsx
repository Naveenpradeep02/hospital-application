import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { History, UserCircle } from "lucide-react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const viewHistory = async (id, name) => {
    try {
      const res = await API.get(`/patients/${id}/history`);
      setHistory(res.data);
      setSelectedPatient(name);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Patients</h2>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search patient..."
            className="border p-2 mb-4 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* TABLE */}

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 flex items-center gap-2">
                        <UserCircle className="text-gray-400 text-xl" />
                        {p.name}
                      </td>

                      <td className="p-3">{p.age}</td>

                      <td className="p-3">{p.phone}</td>

                      <td className="p-3">{p.email || "-"}</td>

                      <td className="p-3">
                        <button
                          onClick={() => viewHistory(p.id, p.name)}
                          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          <History size={16} />
                          History
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HISTORY MODAL */}

      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Visit History — {selectedPatient}
            </h3>

            {history.length === 0 ? (
              <p className="text-gray-500">No previous visits</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="border-b py-2 flex justify-between">
                  <span>
                    {new Date(h.appointment_date).toLocaleDateString("en-GB")}
                  </span>

                  <span className="text-gray-500">{h.doctor_name}</span>
                </div>
              ))
            )}

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setSelectedPatient(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;
