import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-between items-center bg-white shadow p-4">
      {/* <input placeholder="Search..." className="border p-2 rounded w-80" /> */}
      <div></div>

      <Link
        to="/appointments/book"
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Make Appointment
      </Link>
    </div>
  );
}

export default Header;
