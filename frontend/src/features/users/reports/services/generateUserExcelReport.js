import { generateStyledExcel } from "@/shared/utils/reports/generateStyledExcel";

export function generateUserExcelReport({ headers, rows, fileName = "usuarios.xlsx" }) {
    return generateStyledExcel({
        title:     "Reporte de Usuarios",
        sheetName: "Usuarios",
        headers,
        rows,
        fileName,
    });
}
