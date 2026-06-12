//Libreria para manipulacion y generacion de archivos Excel
import * as XLSX from "xlsx";

//Funcion utilitaria para generar un reporte de material consumo en Excel
//Patron: Exportacion de datos (dataset -> archivo descargable)

export function generateConsumableMaterialExcelReport({
  headers,                               //Encabezados de columnas
  rows,                                  //Filas del reporte
  fileName = "material-consumo.xlsx",    //Nombre archivo salida
}) {

  //Fecha actual
  const currentDate = new Date().toLocaleString();

  //Titulo del reporte
  const reportTitle =
    `======= REPORTE DE MATERIAL CONSUMO - ${currentDate} =======`;

  //Estructura de la hoja
  const worksheetData = [
    [reportTitle],
    [],
    headers,
    ...rows,
  ];

  //Convierte array de arrays en hoja Excel
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  //Merge del titulo
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  worksheet["!merges"] = [{
    s: { r: 0, c: 0 },
    e: { r: 0, c: range.e.c },
  }];

  //Ancho columnas
  worksheet["!cols"] = headers.map(() => ({
    wch: 25,
  }));

  //Altura fila titulo
  worksheet["!rows"] = [{
    hpt: 25,
  }];

  //Crea workbook
  const workbook = XLSX.utils.book_new();

  //Agrega hoja
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Material Consumo"
  );

  //Descarga archivo
  XLSX.writeFile(workbook, fileName);
}