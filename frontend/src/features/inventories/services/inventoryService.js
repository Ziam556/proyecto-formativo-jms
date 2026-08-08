const API_URL = "/api/inventories";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getInventories() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener inventarios");
    return res.json();
}

export async function createInventory(name) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear inventario");
    }
    const data = await res.json();
    return data.inventory;
}

export async function updateInventory(id, name) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Error al actualizar inventario");
    const data = await res.json();
    return data.inventory;
}

export async function toggleInventory(id, enabled) {
    const res = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw new Error("Error al cambiar estado de inventario");
    const data = await res.json();
    return data.inventory;
}
