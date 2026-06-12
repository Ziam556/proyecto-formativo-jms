import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateConsumableMaterialPdfReport({
  headers,
  rows,
  fileName = "material-consumo.pdf",
}) {

  const doc = new jsPDF();

  // TÍTULO
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 77);

  doc.text(
    "Reporte de Material Consumo",
    14,
    20
  );

  // FECHA
  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    `Fecha: ${new Date().toLocaleDateString()}`,
    14,
    28
  );

  // TABLA
  autoTable(doc, {
    startY: 35,

    head: [headers],
    body: rows,

    theme: "grid",

    headStyles: {
      fillColor: [0, 48, 77],
      textColor: 255,
      fontSize: 11,
      halign: "center",
      valign: "middle",
      fontStyle: "bold",
    },

    bodyStyles: {
      fontSize: 10,
      textColor: 40,
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    margin: {
      top: 20,
      left: 14,
      right: 14,
      bottom: 20,
    },
  });

  // FOOTER
  const pageCount =
    doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text(
      `Página ${i} de ${pageCount}`,
      170,
      290
    );
  }

  // DESCARGAR
  doc.save(fileName);
}