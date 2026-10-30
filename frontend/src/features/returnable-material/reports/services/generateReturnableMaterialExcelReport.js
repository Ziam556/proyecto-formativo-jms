import { generateStyledExcel } from "@/shared/utils/reports/generateStyledExcel";

export function generateReturnableMaterialExcelReport({ headers, rows, fileName = "material-devolutivo.xlsx" }) {
    return generateStyledExcel({
        title:     "Reporte de Material Devolutivo",
        sheetName: "Mat. Devolutivo",
        headers,
        rows,
        fileName,
    });
}
