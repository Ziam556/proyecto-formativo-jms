import { generateStyledExcel } from "@/shared/utils/reports/generateStyledExcel";

export function generateLoansExcelReport({ headers, rows, fileName = "prestamos.xlsx" }) {
    return generateStyledExcel({
        title:     "Reporte de Préstamos",
        sheetName: "Préstamos",
        headers,
        rows,
        fileName,
    });
}
