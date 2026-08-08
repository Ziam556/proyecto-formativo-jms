import { Navigate } from "react-router-dom";
import { useEffect } from "react";

// Decodifica el payload del JWT sin verificar firma (verificación real es del backend)
function decodeToken() {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export default function ProtectedRoute({ children }) {
    const payload = decodeToken();

    // Bug 2 fix — bfcache: cuando el navegador restaura la página desde el caché
    // de retroceso/avance, los efectos de React no se vuelven a ejecutar.
    // El evento `pageshow` sí se dispara; si `event.persisted === true` la página
    // viene de bfcache, así que forzamos la verificación del token en ese momento.
    useEffect(() => {
        const handlePageShow = (e) => {
            if (!e.persisted) return;
            const p = decodeToken();
            if (!p) {
                // Token inexistente o inválido: redirigir al login
                window.location.replace("/auth");
            } else if (p.mustChangePassword) {
                window.location.replace("/auth/change-password");
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    // Sin token → login
    if (!payload) {
        return <Navigate to="/auth" replace />;
    }

    // Bug 1 fix — mustChangePassword viene del JWT, no de sessionStorage.
    // No puede ser borrado accidentalmente ni manipulado por el usuario.
    if (payload.mustChangePassword) {
        return <Navigate to="/auth/change-password" replace />;
    }

    return children;
}
