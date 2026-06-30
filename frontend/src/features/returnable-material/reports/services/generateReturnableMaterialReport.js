import { buildReturnableMaterialReportDataset } from "../utils/buildReturnableMaterialReportDataset";
import { generateReturnableMaterialExcelReport } from "./generateReturnableMaterialExcelReport";
import { generateReturnableMaterialPdfReport } from "./generateReturnableMaterialPdfReport";

export function generateReturnableMaterialReport({ format, selectedFields, scope, materials = [], selectedIds, filterSerial, filterState }) {
  const { headers, rows } = buildReturnableMaterialReportDataset({
    materials,
    selectedFields,
    scope,
    selectedIds,
    filterSerial,
    filterState,
  });

  if (!rows.length) {
    alert("No hay datos para generar el reporte.");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "excel") {
    generateReturnableMaterialExcelReport({ headers, rows, fileName: `material-devolutivo-${timestamp}.xlsx` });
  }

  if (format === "pdf") {
    generateReturnableMaterialPdfReport({ headers, rows, fileName: `material-devolutivo-${timestamp}.pdf` });
  }
}
