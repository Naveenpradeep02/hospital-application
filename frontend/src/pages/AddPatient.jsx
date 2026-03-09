import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    reference: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/patients", form);

      navigate("/patients");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>

          <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl">
            <form onSubmit={submit} className="grid grid-cols-2 gap-4">
              {/* NAME */}

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Patient Name
                </label>

                <input
                  name="name"
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* AGE */}

              <div>
                <label className="block text-sm font-medium mb-1">Age</label>

                <input
                  name="age"
                  type="number"
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>

                <select
                  name="gender"
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* PHONE */}

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>

                <input
                  name="phone"
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>

                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* REFERENCE */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Reference
                </label>

                <input
                  name="reference"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* ADDRESS */}

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>

                <textarea
                  name="address"
                  onChange={handleChange}
                  rows="3"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* BUTTONS */}

              <div className="col-span-2 flex gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded"
                >
                  Save Patient
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="bg-gray-300 px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
