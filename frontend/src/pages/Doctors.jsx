import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";
import { Edit, UserPlus, Power } from "lucide-react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    consultation_fee: "",
  });

  const [editing, setEditing] = useState(null);

  const loadDoctors = async () => {
    const res = await API.get("/doctors");
    setDoctors(res.data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitDoctor = async (e) => {
    e.preventDefault();

    if (editing) {
      await API.put(`/doctors/${editing}`, form);
    } else {
      await API.post("/doctors", form);
    }

    setForm({
      name: "",
      specialization: "",
      phone: "",
      email: "",
      consultation_fee: "",
    });

    setEditing(null);
    loadDoctors();
  };

  const editDoctor = (doc) => {
    setForm(doc);
    setEditing(doc.id);
  };

  const toggleStatus = async (id) => {
    await API.patch(`/doctors/${id}/status`);
    loadDoctors();
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserPlus />
            Doctors Management
          </h2>

          <input
            type="text"
            placeholder="Search doctor..."
            className="border p-2 rounded mb-5 w-64"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FORM */}

          <div className="bg-white shadow rounded-lg p-5 mb-6">
            <h3 className="font-semibold mb-4">
              {editing ? "Update Doctor" : "Add Doctor"}
            </h3>

            <form onSubmit={submitDoctor} className="grid grid-cols-5 gap-3">
              <input
                name="name"
                placeholder="Doctor Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="consultation_fee"
                placeholder="Consultation Fee"
                value={form.consultation_fee}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <button className="bg-indigo-600 text-white p-2 rounded col-span-5">
                {editing ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>
          </div>

          {/* TABLE */}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Specialization</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Fee</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">Dr. {doc.name}</td>

                    <td className="p-3">{doc.specialization}</td>

                    <td className="p-3">{doc.phone}</td>

                    <td className="p-3">₹{doc.consultation_fee}</td>

                    <td className="p-3 text-center">
                      {doc.active ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => editDoctor(doc)}
                        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => toggleStatus(doc.id)}
                        className="bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Power size={16} />
                        {doc.active ? "Deactivate" : "Activate"}
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

export default Doctors;
