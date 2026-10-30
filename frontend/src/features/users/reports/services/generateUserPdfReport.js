import { generateStyledPdf } from "@/shared/utils/reports/generateStyledPdf";

export function generateUserPdfReport({ headers, rows, fileName = "usuarios.pdf" }) {
    generateStyledPdf({
        title:    "Reporte de Usuarios",
        headers,
        rows,
        fileName,
        orientation: "landscape",
    });
}
