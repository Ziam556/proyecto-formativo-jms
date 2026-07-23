import { Navigate } from "react-router-dom";

/**
 * Protege una ruta por rol de usuario.
 * - Admin: acceso a todo (sin importar roles requeridos)
 * - roles: array de tipos de usuario permitidos, ej. ["Admin", "Inst"]
 * - Si el usuario no tiene permiso, redirige a /dashboard/home
 */
export default function RoleRoute({ children, roles = [] }) {
    const token = sessionStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    let userType = null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userType = payload.userType;
    } catch {
        return <Navigate to="/auth" replace />;
    }

    // Admin tiene acceso a todo
    if (userType === "Admin") return children;

    if (!roles.includes(userType)) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return children;
}
