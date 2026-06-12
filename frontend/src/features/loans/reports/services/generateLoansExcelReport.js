// Libreria para manipulacion y generacion de archivos Excel
import * as XLSX from "xlsx";

// Funcion utilitaria para generar reporte de prestamos en Excel
export function generateLoansExcelReport({
  headers,
  rows,
  fileName = "prestamos.xlsx",
}) {

  // Fecha actual
  const currentDate = new Date().toLocaleString();

  // Titulo del reporte
  const reportTitle =
    `======= REPORTE DE PRÉSTAMOS - ${currentDate} =======`;

  // Estructura de la hoja
  const worksheetData = [
    [reportTitle],
    [],
    headers,
    ...rows,
  ];

  // Convierte arrays en hoja Excel
  const worksheet = XLSX.utils.aoa_to_sheet(
    worksheetData
  );

  // Rango de columnas
  const range = XLSX.utils.decode_range(
    worksheet["!ref"]
  );

  // Merge del titulo
  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: range.e.c },
    },
  ];

  // Estilo titulo
  worksheet["A1"].s = {
    font: {
      bold: true,
      sz: 16,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Ancho columnas
  worksheet["!cols"] = headers.map(() => ({
    wch: 25,
  }));

  // Altura filas
  worksheet["!rows"] = [
    { hpt: 28 },
  ];

  // Crear workbook
  const workbook = XLSX.utils.book_new();

  // Agregar hoja
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Prestamos"
  );

  // Descargar archivo
  XLSX.writeFile(
    workbook,
    fileName
  );
}