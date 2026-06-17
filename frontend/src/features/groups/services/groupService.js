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
