import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-700 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-8">Doctor App</h2>

      <nav className="flex flex-col gap-5">
        <Link className="flex items-center gap-2" to="/dashboard">
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <Link className="flex items-center gap-2" to="/appointments/book">
          <Calendar size={18} /> Appointments Booking
        </Link>
        <Link className="flex items-center gap-2" to="/appointments/manage">
          <Calendar size={18} /> Appointments List
        </Link>

        <Link className="flex items-center gap-2" to="/add">
          <Users size={18} />
          Add Patients
        </Link>
        <Link className="flex items-center gap-2" to="/patients">
          <Users size={18} /> Patients
        </Link>

        <Link className="flex items-center gap-2" to="/doctors">
          <UserRound size={18} /> Doctors
        </Link>

        <Link className="flex items-center gap-2" to="/billing">
          <FileText size={18} /> Billing
        </Link>

        {/* Logout Button */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-auto text-left"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
