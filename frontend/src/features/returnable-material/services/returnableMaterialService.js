const API_URL = "http://localhost:4000/api/returnableMaterial";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getReturnableMaterials() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener los materiales devolutivos");
  return response.json();
}

export async function getReturnableMaterialById(id) {
  const response = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener el material devolutivo");
  return response.json();
}

export async function updateReturnableMaterial(id, data, imageFiles, technicalSheetFile) {
  const formData = new FormData();

  const fields = [
    "materialPlate", "materialCategory", "materialElementName",
    "materialBrand", "materialModel", "materialSerial", "materialPurchaseDate",
    "materialStoryTeller", "materialAmount", "materialUnitValue", "materialTotalValue",
    "materialState", "materialDescription", "materialLocation",
    "materialWidth", "materialLength", "materialDepth", "isEnabled",
  ];

  fields.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const imgFiles = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : []);
  imgFiles.forEach((f) => formData.append("materialImage", f));
  if (technicalSheetFile) formData.append("materialTechnicalSheet", technicalSheetFile);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Error al actualizar el material devolutivo");
  return result;
}

export async function createReturnableMaterial(data, imageFiles, technicalSheetFile) {
  const formData = new FormData();

  const fields = [
    "returnableMaterialId", "materialPlate", "materialCategory", "materialElementName",
    "materialBrand", "materialModel", "materialSerial", "materialPurchaseDate",
    "materialStoryTeller", "materialAmount", "materialUnitValue", "materialTotalValue",
    "materialState", "materialDescription", "materialLocation",
    "materialWidth", "materialLength", "materialDepth",
  ];

  fields.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const imgFiles = Array.isArray(imageFiles) ? imageFiles : (imageFiles ? [imageFiles] : []);
  imgFiles.forEach((f) => formData.append("materialImage", f));
  if (technicalSheetFile) formData.append("materialTechnicalSheet", technicalSheetFile);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const result   = await response.json();

  if (!response.ok) throw new Error(result.error || "Error al crear el material devolutivo");
  return result;
}
