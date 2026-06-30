// Convierte una fila de returnable_material (snake_case, tal como la
// devuelve PostgreSQL) al shape camelCase que esperan las columnas
// de la tabla, los filtros y los reportes de esta feature.
export function normalizeReturnableMaterial(row) {
  return {
    id:            row.returnable_material_id,
    plateSena:     row.material_plate,
    category:      row.material_category,
    elementName:   row.material_element_name,
    brand:         row.material_brand,
    model:         row.material_model  || "",
    serial:        row.material_serial || "",
    purchaseDate:  row.material_purchase_date
      ? new Date(row.material_purchase_date).toISOString().split("T")[0]
      : null,
    amount:        row.material_amount,
    unitValue:     row.material_unit_value,
    totalValue:    row.material_total_value,
    state:         row.material_state,
    technicalSheet: row.material_technical_sheet || null,
    description:   row.material_description,
    accountHolder: row.material_story_teller,
    location:      row.material_location,
    dimensions:    [row.material_width, row.material_length, row.material_depth]
      .filter(Boolean)
      .join(" x ") || null,
    images: (() => {
      if (!row.material_image) return [];
      try { return JSON.parse(row.material_image); } catch { return [row.material_image]; }
    })(),
  };
}

export function normalizeReturnableMaterials(rows) {
  return rows.map(normalizeReturnableMaterial);
}
