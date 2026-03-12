import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients.jsx";

import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import VerifyRoute from "./components/VerifyRoute.jsx";
import Doctors from "./pages/Doctors.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import Billing from "./pages/Billing.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import AppointmentStatus from "./pages/AppointmentStatus.jsx";
import ViewBills from "./pages/ViewBills.jsx";
import BillDetails from "./pages/BillDetails.jsx";
import AppointmentBooking from "./pages/AppointmentBooking";

function App() {
  return (
    <BrowserRouter basename="/appointment">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <VerifyRoute>
              <VerifyOTP />
            </VerifyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/book"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/manage"
          element={
            <ProtectedRoute>
              <AppointmentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <ViewBills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bill/:id"
          element={
            <ProtectedRoute>
              <BillDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/book-appointment" element={<AppointmentBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
