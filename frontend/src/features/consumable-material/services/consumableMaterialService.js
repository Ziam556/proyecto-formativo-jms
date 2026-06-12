const API_URL = "http://localhost:4000/api/consumableMaterial";

export async function createConsumableMaterial(data, imageFile) {
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

  if (imageFile) {
    formData.append("materialImage", imageFile);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al crear el material consumible");
  }

  return result;
}
