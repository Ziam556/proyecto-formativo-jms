export function buildConsumableMaterialReportDataset({
  materials,
  selectedFields,
  scope,
  filterState,
  filterInventory,
  selectedIds = [],
}) {

  let filteredMaterials = [...materials];

  if (scope === "state" && filterState) {
    filteredMaterials = filteredMaterials.filter(
      (material) => material.state === filterState
    );
  }

  if (scope === "inventory" && filterInventory) {
    filteredMaterials = filteredMaterials.filter(
      (material) => material.inventory === filterInventory
    );
  }

  if (scope === "selected" && selectedIds.length > 0) {
    filteredMaterials = filteredMaterials.filter(
      (material) => selectedIds.map(String).includes(String(material.id))
    );
  }

  const headers = selectedFields.map((field) => field.label);

  const rows = filteredMaterials.map((material) =>
    selectedFields.map((field) => {
      const value = material[field.key];
      return value ?? "";
    })
  );

  return { headers, rows };
}