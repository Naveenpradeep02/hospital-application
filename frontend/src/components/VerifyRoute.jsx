import { Navigate } from "react-router-dom";

function VerifyRoute({ children }) {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!email) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default VerifyRoute;
