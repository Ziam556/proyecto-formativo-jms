import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const THEME = {
    background:          "#1e1230",
    color:               "#ffffff",
    confirmButtonColor:  "#71277A",
};

/** Decodifica el payload del JWT sin librería externa. */
function getTokenPayload(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

/**
 * Guarda de ruta: solo permite el acceso si el usuario es Administrador.
 * Si no tiene permiso, muestra un modal SweetAlert2 y regresa a la página anterior.
 */
export default function AdminRoute() {
    const navigate  = useNavigate();
    const [allowed, setAllowed] = useState(null); // null = verificando

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/auth", { replace: true });
            return;
        }

        const payload  = getTokenPayload(token);
        const userType = payload?.userType ?? "";

        if (userType === "Admin") {
            setAllowed(true);
            return;
        }

        // No es admin → mostrar modal y regresar
        Swal.fire({
            icon:               "error",
            title:              "Acceso denegado",
            text:               "No tienes permisos para acceder a este módulo. Se requiere tipo de usuario Administrador.",
            confirmButtonText:  "Entendido",
            iconColor:          "#f87171",
            allowOutsideClick:  false,
            allowEscapeKey:     false,
            ...THEME,
        }).then(() => navigate(-1));
    }, [navigate]);

    // null = verificando (no renderizar nada), false = no permitido (modal activo)
    if (!allowed) return null;

    return <Outlet />;
}
