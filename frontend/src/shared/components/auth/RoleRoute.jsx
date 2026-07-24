import { Navigate } from "react-router-dom";

/**
 * Protege una ruta por grupo de usuario.
 * - Administrador: acceso a todo
 * - roles: array de grupos permitidos, ej. ["Administrador", "Instructor"]
 * - Si el usuario no tiene permiso, redirige a /dashboard/home
 */
export default function RoleRoute({ children, roles = [] }) {
    const token = sessionStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    let userGroup = null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userGroup = payload.userGroup;
    } catch {
        return <Navigate to="/auth" replace />;
    }

    // Administrador tiene acceso a todo
    if (userGroup === "Administrador") return children;

    if (!roles.includes(userGroup)) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return children;
}
