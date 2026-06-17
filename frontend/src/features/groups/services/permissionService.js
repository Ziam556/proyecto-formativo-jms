const API_URL = "/api/groups";

export async function getGroupPermissions(groupId) {
    const response = await fetch(`${API_URL}/${groupId}/permissions`);
    if (!response.ok) throw new Error("Error obteniendo permisos del grupo");
    return response.json();
}
