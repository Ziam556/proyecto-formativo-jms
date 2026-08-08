// Helper: parsea el campo accountholders que llega como JSON array del backend
function parseAccountholders(raw) {
  if (!raw) return [];
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
}

export function normalizeConsumableMaterial(row) {
  const holders = parseAccountholders(row.accountholders);

  return {
    id:           row.consumable_material_id,
    plateSena:    row.material_plate,
    elementName:  row.material_element_name,
    category:     row.material_category || "",
    inventory:    row.material_inventory || "",
    brand:        row.material_brand,
    entryDate:    row.material_entry_date
      ? new Date(row.material_entry_date).toISOString().split("T")[0]
      : null,
    purchaseDate: row.material_purchase_date
      ? new Date(row.material_purchase_date).toISOString().split("T")[0]
      : null,
    amount:       row.material_amount,
    unitValue:    row.material_unit_value,
    totalValue:   row.material_total_value,
    state:        row.material_state,
    // String listo para mostrar en tabla/reporte
    accountHolder: holders.map((h) => h.user_name).join(", ") || "—",
    // Array completo para el formulario de edición
    accountholders: holders,
    location:     row.material_location,
    description:  row.material_description,
    technicalSheet: row.material_technical_sheet || null,
    quotations: (() => {
      if (!row.material_quotations) return [];
      try { return JSON.parse(row.material_quotations); } catch { return []; }
    })(),
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
