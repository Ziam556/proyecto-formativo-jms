const API_URL = "http://localhost:4000/api/returnableMaterial";

export async function createReturnableMaterial(data, imageFile, technicalSheetFile) {
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

  if (imageFile)          formData.append("materialImage",         imageFile);
  if (technicalSheetFile) formData.append("materialTechnicalSheet", technicalSheetFile);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  const result   = await response.json();

  if (!response.ok) throw new Error(result.error || "Error al crear el material devolutivo");
  return result;
}
