import { generateStyledPdf } from "@/shared/utils/reports/generateStyledPdf";

export function generateLoansPdfReport({ headers, rows, fileName = "prestamos.pdf" }) {
    generateStyledPdf({
        title:    "Reporte de Préstamos",
        headers,
        rows,
        fileName,
        orientation: "landscape",
    });
}
