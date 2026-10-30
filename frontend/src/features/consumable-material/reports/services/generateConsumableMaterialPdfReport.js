import { generateStyledPdf } from "@/shared/utils/reports/generateStyledPdf";

export function generateConsumableMaterialPdfReport({ headers, rows, fileName = "material-consumible.pdf" }) {
    generateStyledPdf({
        title:    "Reporte de Material de Consumo",
        headers,
        rows,
        fileName,
        orientation: "landscape",
    });
}
