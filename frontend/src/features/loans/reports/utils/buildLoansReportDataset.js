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
      return value ?? "";
    })
  );

  return { headers, rows };
}