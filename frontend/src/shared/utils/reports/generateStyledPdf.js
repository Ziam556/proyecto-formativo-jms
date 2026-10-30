import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Paleta del sistema ───────────────────────────────────────────────────────
const C = {
    navy:       [14,  18,  62],   // #0e123e  fondo app
    purple:     [126, 34, 206],   // #7e22ce  acento principal
    purpleLight:[237, 233,254],   // #ede9fe  fila alterna
    cyan:       [80, 229, 249],   // #50E5F9  acento secundario
    white:      [255,255,255],
    gray:       [100,100,100],
    lightGray:  [240,242,248],
    text:       [30,  30,  50],
};

/**
 * Genera un PDF estilizado con diseño profesional.
 *
 * @param {object} opts
 * @param {string}   opts.title      - Título del reporte (ej. "Reporte de Préstamos")
 * @param {string}   opts.subtitle   - Subtítulo opcional (ej. "Sistema de Inventario JMS")
 * @param {string[]} opts.headers    - Encabezados de columna
 * @param {any[][]}  opts.rows       - Filas de datos
 * @param {string}   opts.fileName   - Nombre del archivo de salida
 * @param {"portrait"|"landscape"} opts.orientation
 */
export function generateStyledPdf({
    title,
    subtitle = "Sistema de Inventario JMS — SENA",
    headers,
    rows,
    fileName = "reporte.pdf",
    orientation = "landscape",
}) {
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── Franja superior ────────────────────────────────────────────────────────
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, pageW, 28, "F");

    // Línea de acento cyan bajo la franja
    doc.setFillColor(...C.cyan);
    doc.rect(0, 28, pageW, 1.5, "F");

    // Título en la franja
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...C.white);
    doc.text(title, 14, 12);

    // Subtítulo en la franja
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.cyan);
    doc.text(subtitle, 14, 20);

    // Fecha/hora en esquina derecha de la franja
    const now = new Date().toLocaleString("es-CO", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
    doc.setFontSize(7.5);
    doc.setTextColor(...C.white);
    doc.text(`Generado: ${now}`, pageW - 14, 20, { align: "right" });

    // ── Tabla ─────────────────────────────────────────────────────────────────
    autoTable(doc, {
        startY: 36,
        head: [headers],
        body: rows,
        theme: "plain",

        styles: {
            fontSize: 8.5,
            cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
            valign: "middle",
            halign: "center",
            textColor: C.text,
            lineColor: [210, 215, 230],
            lineWidth: 0.2,
        },

        headStyles: {
            fillColor: C.purple,
            textColor: C.white,
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
        },

        bodyStyles: {
            fillColor: C.white,
        },

        alternateRowStyles: {
            fillColor: C.purpleLight,
        },

        columnStyles: {
            0: { halign: "left" },
        },

        margin: { top: 36, left: 12, right: 12, bottom: 16 },

        // ── Pie de cada página ──────────────────────────────────────────────
        didDrawPage(data) {
            const pg   = doc.internal.getCurrentPageInfo().pageNumber;
            const total = doc.internal.getNumberOfPages();

            // Línea separadora del pie
            doc.setDrawColor(...C.purple);
            doc.setLineWidth(0.4);
            doc.line(12, pageH - 12, pageW - 12, pageH - 12);

            // Texto izquierda
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(...C.gray);
            doc.text("Sistema de Inventario JMS — SENA", 12, pageH - 7);

            // Texto derecha
            doc.text(`Página ${pg} de ${total}`, pageW - 12, pageH - 7, { align: "right" });
        },
    });

    doc.save(fileName);
}
