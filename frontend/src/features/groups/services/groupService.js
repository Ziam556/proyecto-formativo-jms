const API_URL = "/api/groups";

export async function getGroups() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error obteniendo grupos");
    return response.json();
}

export async function createGroup(groupName, permissionCodenames) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName, permissionCodenames }),
    });
    if (!response.ok) throw new Error("Error creando grupo");
    return response.json();
}

export async function getGroupPermissions(groupId) {
    const response = await fetch(`${API_URL}/${groupId}/permissions`);
    if (!response.ok) throw new Error("Error obteniendo permisos del grupo");
    return response.json();
}

export async function addUsersToGroup(groupId, documentNumbers) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${groupId}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentNumbers }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error agregando usuarios al grupo");
    return data;
}

export async function getGroupUsers(groupId) {
    const response = await fetch(`/api/groups/${groupId}/users`);
    if (!response.ok) throw new Error("Error obteniendo usuarios del grupo");
    return response.json();
}

export async function removeUsersFromGroup(groupId, documentNumbers) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`/api/groups/${groupId}/users`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentNumbers }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error eliminando usuarios del grupo");
    return data;
}

export async function updateGroup(groupId, groupName, permissionCodenames) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${groupId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupName, permissionCodenames }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error actualizando grupo");
    return data;
}
