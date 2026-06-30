// Convierte una fila de consumable_material (snake_case, tal como la
// devuelve PostgreSQL) al shape camelCase que ya esperan las columnas
// de la tabla, los filtros y los reportes de esta feature.
export function normalizeConsumableMaterial(row) {
  return {
    id: row.consumable_material_id,
    plateSena: row.material_plate,
    elementName: row.material_element_name,
    brand: row.material_brand,
    purchaseDate: row.material_purchase_date
      ? new Date(row.material_purchase_date).toISOString().split("T")[0]
      : null,
    amount: row.material_amount,
    unitValue: row.material_unit_value,
    totalValue: row.material_total_value,
    state: row.material_state,
    accountHolder: row.material_story_teller,
    location: row.material_location,
    description: row.material_description,
    images: (() => {
      if (!row.material_image) return [];
      try { return JSON.parse(row.material_image); } catch { return [row.material_image]; }
    })(),
    enabled: row.enabled,
  };
}

export function normalizeConsumableMaterials(rows) {
  return rows.map(normalizeConsumableMaterial);
}