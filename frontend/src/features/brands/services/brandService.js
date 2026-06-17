const API_URL = "/api/brands";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getBrands() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener marcas");
    return res.json();
}

export async function createBrand(name) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Error al crear marca");
    const data = await res.json();
    return data.brand;
}

export async function updateBrand(id, name) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Error al actualizar marca");
    const data = await res.json();
    return data.brand;
}

export async function toggleBrand(id, enabled) {
    const res = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error("Error al cambiar estado");
    const data = await res.json();
    return data.brand;
}
