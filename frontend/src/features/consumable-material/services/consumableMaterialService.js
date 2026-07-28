const API_URL = "http://localhost:4000/api/consumableMaterial";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createConsumableMaterial(data, imageFiles) {
  const formData = new FormData();

  const fields = [
    "consumableMaterialId",
    "materialPlate",
    "materialElementName",
    "materialBrand",
    "materialStoryTeller",
    "materialAmount",
    "materialUnitValue",
    "materialTotalValue",
    "materialState",
    "materialDescription",
    "materialPurchaseDate",
    "materialLocation",
  ];

  fields.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const files = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : []);
  files.forEach((f) => formData.append("materialImage", f));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al crear el material consumible");
  }

  return result;
}

// Listar todos los materiales de consumo (reemplaza data/ConsumableMaterials.js)
export async function getConsumableMaterials() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener los materiales de consumo");
  return response.json();
}

// Obtener un material de consumo por id
export async function getConsumableMaterialById(id) {
  const response = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener el material de consumo");
  return response.json();
}

// Actualizar material de consumo. Misma forma de armar FormData que create.
export async function updateConsumableMaterial(id, data, imageFiles) {
  const formData = new FormData();

  const fields = [
    "materialPlate",
    "materialElementName",
    "materialBrand",
    "materialStoryTeller",
    "materialAmount",
    "materialUnitValue",
    "materialTotalValue",
    "materialState",
    "materialDescription",
    "materialPurchaseDate",
    "materialLocation",
    "isEnabled",
  ];

  fields.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const files = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : []);
  files.forEach((f) => formData.append("materialImage", f));

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al actualizar el material consumible");
  }

  return result;
}

// Habilitar / deshabilitar material de consumo
export async function toggleConsumableMaterial(id, enabled) {
  const response = await fetch(`${API_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Error al cambiar el estado del material");
  }
  return result;
}
export async function deleteConsumableMaterial(id) {
  const token    = sessionStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method:  "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Error al eliminar el material");
  return result;
}
