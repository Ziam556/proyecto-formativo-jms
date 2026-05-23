import * as XLSX from "xlsx";

export function generateReturnableMaterialExcelReport({ headers, rows, fileName = "material-devolutivo.xlsx" }) {
  const currentDate = new Date().toLocaleString();
  const reportTitle = `***** REPORTE DE MATERIAL DEVOLUTIVO - ${currentDate} *****`;

  const worksheetData = [[reportTitle], [], headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: range.e.c } }];
  worksheet["!cols"] = headers.map(() => ({ wch: 22 }));
  worksheet["!rows"] = [{ hpt: 25 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Material Devolutivo");
  XLSX.writeFile(workbook, fileName);
}
