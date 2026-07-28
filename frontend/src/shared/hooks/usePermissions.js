/**
 * Hook que expone los permisos del usuario actual a partir del JWT.
 *
 * El token incluye:
 *   - userGroup: "Administrador" | "Instructor" | "Invitado"
 *   - permissions: string[] — codenames efectivos (grupo + individuales)
 *
 * Un Administrador siempre tiene acceso a todo, independientemente
 * de si tiene codenames asignados o no.
 */

function decodeToken() {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export function usePermissions() {
    const payload     = decodeToken();
    const userGroup   = payload?.userGroup   ?? "";
    const permissions = payload?.permissions ?? [];
    const isAdmin     = userGroup === "Administrador";

    /**
     * Comprueba si el usuario tiene un permiso específico.
     * - Administrador siempre devuelve true.
     * - Si codename es un array, devuelve true si tiene AL MENOS UNO.
     * - Si codename es null/undefined, devuelve true (ruta pública autenticada).
     */
    function hasPermission(codename) {
        if (isAdmin) return true;
        if (!codename) return true;
        if (Array.isArray(codename)) {
            return codename.some((c) => permissions.includes(c));
        }
        return permissions.includes(codename);
    }

    return { permissions, userGroup, isAdmin, hasPermission };
}
