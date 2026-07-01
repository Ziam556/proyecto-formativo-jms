import { buildLoansReportDataset } from "../utils/buildLoansReportDataset";

import { generateLoansExcelReport } from "./generateLoansExcelReport";

import { generateLoansPdfReport } from "./generateLoansPdfReport";

import { alertWarning } from "@/shared";

export function generateLoansReport({
  loans,
  format,
  selectedFields,
  scope,
  selectedIds,
  filterSerial,
  filterState,
}) {

  // Construir dataset
  const { headers, rows } =
    buildLoansReportDataset({

      loans,

      selectedFields,

      scope,

      selectedIds,

      filterSerial,

      filterState,

    });

  // Validación
  if (!rows.length) {

    alertWarning(
      "Sin datos",
      "No hay datos para generar el reporte."
    );

    return;
  }

  // Fecha archivo
  const timestamp =
    new Date()
      .toISOString()
      .slice(0, 10);

  // =========================
  // EXCEL
  // =========================
  if (format === "excel") {

    generateLoansExcelReport({

      headers,

      rows,

      fileName:
        `prestamos-${timestamp}.xlsx`,

    });

  }

  // =========================
  // PDF
  // =========================
  if (format === "pdf") {

    generateLoansPdfReport({

      headers,

      rows,

      fileName:
        `prestamos-${timestamp}.pdf`,

    });

  }

}