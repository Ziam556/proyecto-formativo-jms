const API_URL = "http://localhost:4000/api/permissions";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

export async function getPermissions() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener permisos");
    return res.json();
}

export async function createPermission({ name, codename, module }) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, codename, module }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear el permiso");
    return data;
}

export async function updatePermission(id, { name, codename, module }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, codename, module }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al actualizar el permiso");
    return data;
}
