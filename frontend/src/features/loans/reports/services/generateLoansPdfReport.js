import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateLoansPdfReport({
  headers,
  rows,
  fileName = "prestamos.pdf",
}) {

  // Crear documento
  const doc = new jsPDF({
    orientation: "landscape",
  });

  // Fecha actual
  const currentDate =
    new Date().toLocaleString();

  // =========================
  // TITULO
  // =========================
  doc.setFontSize(18);

  doc.setTextColor(0, 48, 77);

  doc.text(
    "Reporte de Préstamos",
    14,
    18
  );

  // =========================
  // FECHA
  // =========================
  doc.setFontSize(10);

  doc.setTextColor(90);

  doc.text(
    `Fecha de generación: ${currentDate}`,
    14,
    26
  );

  // =========================
  // TABLA
  // =========================
  autoTable(doc, {

    startY: 35,

    head: [headers],

    body: rows,

    theme: "grid",

    styles: {
      fontSize: 9,
      cellPadding: 4,
      valign: "middle",
      halign: "center",
    },

    headStyles: {
      fillColor: [0, 48, 77],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },

    bodyStyles: {
      textColor: 40,
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    margin: {
      top: 30,
      left: 14,
      right: 14,
      bottom: 20,
    },

  });

  // =========================
  // FOOTER
  // =========================
  const totalPages =
    doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {

    doc.setPage(i);

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(
      `Página ${i} de ${totalPages}`,
      250,
      200
    );

  }

  // =========================
  // DESCARGAR PDF
  // =========================
  doc.save(fileName);

}