import Swal from "sweetalert2";

/**
 * Muestra confirmación, llama al backend, limpia sesión y redirige al login.
 * @param {Function} navigate - función de react-router-dom
 */
export async function handleLogout(navigate) {
    // Paso 2 — Confirmación con SweetAlert2
    const result = await Swal.fire({
        title: "¿Seguro que quiere cerrar sesión?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        confirmButtonColor: "#7e22ce",
        cancelButtonColor: "#6b7280",
        background: "#1e1e2e",
        color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    // Paso 3 — Validar que exista sesión activa
    const token = sessionStorage.getItem("token");
    if (!token) {
        navigate("/auth", { replace: true });
        return;
    }

    // Paso 4 — Cerrar sesión en el servidor
    try {
        await fetch("http://localhost:4000/api/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch {
        // Si el servidor no responde, igual se limpia el cliente
    }

    // Paso 5 — Eliminar datos de sesión en el cliente
    sessionStorage.removeItem("token");

    // Paso 6 — Redirigir al login
    navigate("/auth", { replace: true });
}
