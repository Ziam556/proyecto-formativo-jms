const API_URL = "/api/quotations";
const CONSUMABLE_URL = "/api/consumableMaterial";
const RETURNABLE_URL = "/api/returnableMaterial";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export async function getQuotations() {
    const res = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener cotizaciones");
    return res.json();
}

export async function getConsumableMaterials() {
    const res = await fetch(CONSUMABLE_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener materiales de consumo");
    return res.json();
}

export async function getReturnableMaterials() {
    const res = await fetch(RETURNABLE_URL, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener materiales devolutivos");
    return res.json();
}

export async function addQuotation(materialType, materialId, file) {
    const formData = new FormData();
    formData.append("materialType", materialType);
    formData.append("materialId", String(materialId));
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

export async function removeQuotation(materialType, materialId, filePath) {
    const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ materialType, materialId, filePath }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar cotización");
    return data;
}
