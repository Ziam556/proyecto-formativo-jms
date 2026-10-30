const API_URL = "/api/quotations";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export async function getQuotations() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener cotizaciones");
    return res.json();
}

export async function addQuotation({ referenceId, itemName, inventoryName, file }) {
    const formData = new FormData();
    if (referenceId)   formData.append("referenceId",   referenceId);
    if (itemName)      formData.append("itemName",       itemName);
    if (inventoryName) formData.append("inventoryName",  inventoryName);
    formData.append("quotationFile", file);

    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al agregar cotización");
    return data;
}

export async function removeQuotation(quotationId) {
    const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ quotationId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar cotización");
    return data;
}
