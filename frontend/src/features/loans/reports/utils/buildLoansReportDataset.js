export function buildLoansReportDataset({
  loans,
  selectedFields,
  scope,
  filterSerial,
  filterState,
  selectedIds = [],
}) {
  let filteredLoans = [...loans];

  if (scope === "serial" && filterSerial) {
    filteredLoans = filteredLoans.filter(
      (loan) => loan.serial === filterSerial
    );
  }

  if (scope === "state" && filterState) {
    filteredLoans = filteredLoans.filter(
      (loan) => loan.state === filterState
    );
  }

  if (scope === "selected" && selectedIds.length > 0) {
    filteredLoans = filteredLoans.filter(
      (loan) => selectedIds.map(String).includes(String(loan.id))
    );
  }

  const headers = selectedFields.map((field) => field.label);

  const rows = filteredLoans.map((loan) =>
    selectedFields.map((field) => {
      const value = loan[field.key];

      // El campo materiales es un array de objetos — se serializa a texto legible
      if (field.key === "materiales" && Array.isArray(value)) {
        return value.map((m) => `${m.name} (${m.type})`).join(", ") || "—";
      }

      return value ?? "";
    })
  );

  return { headers, rows };
}