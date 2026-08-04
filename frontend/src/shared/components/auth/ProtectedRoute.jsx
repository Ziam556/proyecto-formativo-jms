import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token             = sessionStorage.getItem("token");
  const mustChangePassword = sessionStorage.getItem("must_change_password");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (mustChangePassword === "true") {
    return <Navigate to="/auth/change-password" replace />;
  }

  return children;
}
