export function buildReturnableMaterialReportDataset({
  materials,
  selectedFields,
  scope,
  selectedIds = [],
  filterSerial,
  filterState,
}) {
  let filtered = [...materials];

  if (scope === "selected" && selectedIds.length > 0) {
    filtered = filtered.filter((m) =>
      selectedIds.map(String).includes(String(m.id))
    );
  }

  if (scope === "serial" && filterSerial) {
    filtered = filtered.filter((m) => m.serial === filterSerial);
  }

  if (scope === "state" && filterState) {
    filtered = filtered.filter((m) => m.state === filterState);
  }

  const headers = selectedFields.map((f) => f.label);

  const rows = filtered.map((material) =>
    selectedFields.map((field) => {
      const value = material[field.key];
      return value ?? "";
    })
  );

  return { headers, rows };
}
