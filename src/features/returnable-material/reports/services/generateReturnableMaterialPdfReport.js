import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateReturnableMaterialPdfReport({ headers, rows, fileName = "material-devolutivo.pdf" }) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text("Reporte de Material Devolutivo", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: [124, 58, 237],
      textColor: 255,
      fontSize: 9,
    },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  });

  doc.save(fileName);
}
