import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const THEME = {
    background:          "#1e1230",
    color:               "#ffffff",
    confirmButtonColor:  "#71277A",
};

/** Devuelve la fecha de expiración del JWT en milisegundos, o null si falla. */
function getTokenExpiry(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return typeof payload.exp === "number" ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
}

const WARNING_MS = 10 * 60 * 1000; // 10 minutos en ms

/**
 * Hook que vigila la expiración del token JWT en sessionStorage.
 * - 10 min antes: aviso de advertencia (SweetAlert2).
 * - Al expirar: modal de sesión vencida → redirige a /auth.
 * Montar en DashboardLayout para cubrir todas las páginas autenticadas.
 */
export function useSessionExpiry() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const expiryMs = getTokenExpiry(token);
        if (!expiryMs) return;

        const now           = Date.now();
        const msUntilExpiry = expiryMs - now;
        const msUntilWarn   = msUntilExpiry - WARNING_MS;

        // Ya expiró antes de que montara el componente
        if (msUntilExpiry <= 0) {
            sessionStorage.removeItem("token");
            navigate("/auth", { replace: true });
            return;
        }

        const timers = [];

        const showWarning = () =>
            Swal.fire({
                icon:              "warning",
                title:             "Sesión por expirar",
                text:              "Tu sesión expirará en 10 minutos. Guarda tu trabajo para no perder cambios.",
                confirmButtonText: "Ok",
                iconColor:         "#fbbf24",
                ...THEME,
            });

        const showExpired = async () => {
            sessionStorage.removeItem("token");
            await Swal.fire({
                icon:               "error",
                title:              "Sesión expirada",
                text:               "Tu sesión ha expirado. Inicia sesión nuevamente para continuar.",
                confirmButtonText:  "Ok",
                iconColor:          "#f87171",
                allowOutsideClick:  false,
                allowEscapeKey:     false,
                ...THEME,
            });
            navigate("/auth", { replace: true });
        };

        if (msUntilWarn > 0) {
            // Todavía quedan más de 10 min: programar aviso y expiración
            timers.push(setTimeout(showWarning,  msUntilWarn));
            timers.push(setTimeout(showExpired,  msUntilExpiry));
        } else {
            // Quedan menos de 10 min: mostrar aviso ya y programar expiración
            showWarning();
            timers.push(setTimeout(showExpired, msUntilExpiry));
        }

        return () => timers.forEach(clearTimeout);
    }, [navigate]);
}
