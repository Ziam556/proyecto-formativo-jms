import { generateStyledPdf } from "@/shared/utils/reports/generateStyledPdf";

export function generateReturnableMaterialPdfReport({ headers, rows, fileName = "material-devolutivo.pdf" }) {
    generateStyledPdf({
        title:    "Reporte de Material Devolutivo",
        headers,
        rows,
        fileName,
        orientation: "landscape",
    });
}
