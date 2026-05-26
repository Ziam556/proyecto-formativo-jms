import { ListLoans } from "../../data/ListLoans";

import { buildLoansReportDataset } from "../utils/buildLoansReportDataset";

import { generateLoansExcelReport } from "./generateLoansExcelReport";

import { generateLoansPdfReport } from "./generateLoansPdfReport";

export function generateLoansReport({
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

      loans: ListLoans,

      selectedFields,

      scope,

      selectedIds,

      filterSerial,

      filterState,

    });

  // Validación
  if (!rows.length) {

    alert(
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