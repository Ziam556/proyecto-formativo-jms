const API_URL = "/api/loans";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function createLoan(loanData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el préstamo");
    }
    return response.json();
}

export async function getLoans() {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Error al obtener los préstamos");
    return response.json();
}
