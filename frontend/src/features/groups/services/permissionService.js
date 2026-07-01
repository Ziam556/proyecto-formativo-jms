const API_URL = "/api/groups";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

export async function getGroupPermissions(groupId) {
    const response = await fetch(`${API_URL}/${groupId}/permissions`);
    if (!response.ok) throw new Error("Error obteniendo permisos del grupo");
    return response.json();
}

export async function getPermissions() {
    const response = await fetch(`${API_URL}/permissions`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error obteniendo permisos");
    return response.json();
}
