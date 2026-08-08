function parseAccountholders(raw) {
  if (!raw) return [];
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
}

export function normalizeReturnableMaterial(row) {
  const holders = parseAccountholders(row.accountholders);

  return {
    id:            row.returnable_material_id,
    plateSena:     row.material_plate,
    category:      row.material_category,
    inventory:     row.material_inventory || "",
    elementName:   row.material_element_name,
    brand:         row.material_brand,
    model:         row.material_model  || "",
    serial:        row.material_serial || "",
    purchaseDate:  row.material_purchase_date
      ? new Date(row.material_purchase_date).toISOString().split("T")[0]
      : null,
    entryDate:     row.material_entry_date
      ? new Date(row.material_entry_date).toISOString().split("T")[0]
      : null,
    amount:        row.material_amount,
    unitValue:     row.material_unit_value,
    totalValue:    row.material_total_value,
    state:         row.material_state,
    technicalSheet: row.material_technical_sheet || null,
    quotations: (() => {
      if (!row.material_quotations) return [];
      try { return JSON.parse(row.material_quotations); } catch { return []; }
    })(),
    description:   row.material_description,
    // String listo para mostrar en tabla/reporte
    accountHolder:  holders.map((h) => h.user_name).join(", ") || "—",
    // Array completo para el formulario de edición
    accountholders: holders,
    location:      row.material_location,
    dimensions:    [row.material_width, row.material_length, row.material_depth]
      .filter(Boolean)
      .join(" x ") || null,
    images: (() => {
      if (!row.material_image) return [];
      try { return JSON.parse(row.material_image); } catch { return [row.material_image]; }
    })(),
    enabled: row.enabled,
  };
}

export function normalizeReturnableMaterials(rows) {
  return rows.map(normalizeReturnableMaterial);
}
