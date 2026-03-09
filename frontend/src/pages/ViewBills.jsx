import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";

function ViewBills() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const res = await API.get("/billing");
      setBills(res.data);
    } catch (err) {
      console.error("Failed to load bills", err);
    }
  };

  const filteredBills = bills.filter((b) =>
    b.patient?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Billing History</h2>

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search patient..."
            className="border p-2 mb-4 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* TABLE */}

          <div className="bg-white shadow rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Bill ID</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-center">Payment</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No Bills Found
                    </td>
                  </tr>
                )}

                {filteredBills.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{b.id}</td>

                    <td className="p-3">{b.patient}</td>

                    <td className="p-3">{b.doctor}</td>

                    <td className="p-3 text-center capitalize">
                      {b.payment_mode}
                    </td>

                    <td className="p-3 text-center">₹ {b.total}</td>

                    <td className="p-3 text-center">
                      {new Date(b.created_at).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate(`/bill/${b.id}`)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBills;
