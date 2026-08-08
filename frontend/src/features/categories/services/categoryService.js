const API_URL = "/api/categories";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getCategories() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
}

export async function createCategory(name, prefix = "") {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, prefix }),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear categoría");
    }
    const data = await res.json();
    return data.category;
}

export async function updateCategory(id, name, prefix) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, prefix }),
    });
    if (!res.ok) throw new Error("Error al actualizar categoría");
    const data = await res.json();
    return data.category;
}

export async function toggleCategory(id, enabled) {
    const res = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error("Error al cambiar estado de categoría");
    const data = await res.json();
    return data.category;
}
