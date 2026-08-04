const API_URL = "/api/auth";

export async function login(userData) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userData.userEmail,
            password: userData.userPassword,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error login");
    }

    return response.json();
}

export async function changeFirstPassword(newPassword) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/change-first-password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al cambiar la contraseña");
    }

    return response.json();
}
