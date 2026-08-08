import { buildConsumableMaterialReportDataset } from "../utils/buildConsumableMaterialReportDataset";
import { generateConsumableMaterialExcelReport } from "./generateConsumableMaterialExcelReport";
import { generateConsumableMaterialPdfReport } from "./generateConsumableMaterialPdfReport";

export function generateConsumableMaterialReport({
  format,
  selectedFields,
  scope,
  selectedIds,
  filterState,
  filterInventory,
  materials,
}) {

  const { headers, rows } = buildConsumableMaterialReportDataset({
    materials: materials ?? [],
    selectedFields,
    scope,
    selectedIds,
    filterState,
    filterInventory,
  });

  if (!rows.length) {
    alert("No hay datos para generar el reporte.");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "excel") {
    generateConsumableMaterialExcelReport({
      headers,
      rows,
      fileName: `material-consumo-${timestamp}.xlsx`,
    });
  }

  if (format === "pdf") {
    generateConsumableMaterialPdfReport({
      headers,
      rows,
      fileName: `material-consumo-${timestamp}.pdf`,
    });
  }
}
