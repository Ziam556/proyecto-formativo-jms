import { generateStyledExcel } from "@/shared/utils/reports/generateStyledExcel";

export function generateConsumableMaterialExcelReport({ headers, rows, fileName = "material-consumible.xlsx" }) {
    return generateStyledExcel({
        title:     "Reporte de Material de Consumo",
        sheetName: "Mat. Consumo",
        headers,
        rows,
        fileName,
    });
}
