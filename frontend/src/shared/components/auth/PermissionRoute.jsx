import { Navigate } from "react-router-dom";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useEffect, useRef } from "react";
import { alertError } from "@/shared/utils/alerts";

function NoPermission() {
    const alerted = useRef(false);
    useEffect(() => {
        if (alerted.current) return;
        alerted.current = true;
        alertError("Sin permiso", "No tienes permiso para acceder a esta sección.");
    }, []);
    return <Navigate to="/dashboard/home" replace />;
}

export default function PermissionRoute({ children, permission, adminOnly = false }) {
    const token = sessionStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    const { isAdmin, hasPermission } = usePermissions();

    if (adminOnly) {
        return isAdmin ? children : <NoPermission />;
    }

    return hasPermission(permission) ? children : <NoPermission />;
}
