import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const token = sessionStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/auth" replace />;
}