export function buildReturnableMaterialReportDataset({
  materials,
  selectedFields,
  scope,
  filterSerial,
  filterState,
}) {
  let filtered = [...materials];

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
