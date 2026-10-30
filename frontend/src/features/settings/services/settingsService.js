const API_URL = "/api/settings";

/** Obtiene el correo de contacto/soporte almacenado en el sistema. */
export async function getContactEmail() {
    try {
        const res = await fetch(`${API_URL}/contact-email`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.value || null;
    } catch {
        return null;
    }
}

/** Actualiza el correo de contacto (solo SuperAdministrador). */
export async function updateContactEmail(email) {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${API_URL}/contact-email`, {
        method:  "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ value: email }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al actualizar el correo de contacto");
    }
    return res.json();
}
