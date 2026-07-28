import { Navigate } from "react-router-dom";
import { usePermissions } from "@/shared/hooks/usePermissions";

/**
 * Protege una ruta basándose en permisos del JWT, no en el grupo de usuario.
 *
 * Props:
 *   - permission  {string|string[]} Codename requerido (o array de opciones OR).
 *   - adminOnly   {boolean}         Solo para Administrador, sin importar permisos.
 *   - children    El componente de la ruta.
 *
 * Comportamiento:
 *   - Sin token → redirige a /auth
 *   - Administrador → siempre pasa (es superusuario)
 *   - adminOnly y no es admin → redirige a /dashboard/home
 *   - hasPermission(permission) → pasa
 *   - Sin permiso → redirige a /dashboard/home
 */
export default function PermissionRoute({ children, permission, adminOnly = false }) {
    const token = sessionStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    const { isAdmin, hasPermission } = usePermissions();

    if (adminOnly) {
        return isAdmin ? children : <Navigate to="/dashboard/home" replace />;
    }

    return hasPermission(permission) ? children : <Navigate to="/dashboard/home" replace />;
}
