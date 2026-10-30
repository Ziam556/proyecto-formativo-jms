import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ─── Paleta del sistema ───────────────────────────────────────────────────────
const NAVY   = "0E123E";
const PURPLE = "7E22CE";
const CYAN   = "50E5F9";
const PURPLE_LIGHT = "EDE9FE";
const WHITE  = "FFFFFF";
const GRAY   = "6B7280";
const ROW_ALT = "F5F3FF";

/**
 * Genera un Excel estilizado con diseño profesional.
 *
 * @param {object} opts
 * @param {string}   opts.title     - Título del reporte
 * @param {string}   opts.sheetName - Nombre de la pestaña
 * @param {string[]} opts.headers   - Encabezados de columna
 * @param {any[][]}  opts.rows      - Filas de datos
 * @param {string}   opts.fileName  - Nombre del archivo de salida
 */
export async function generateStyledExcel({
    title,
    sheetName = "Reporte",
    headers,
    rows,
    fileName = "reporte.xlsx",
}) {
    const workbook  = new ExcelJS.Workbook();
    workbook.creator  = "Sistema de Inventario JMS";
    workbook.created  = new Date();

    const sheet = workbook.addWorksheet(sheetName, {
        views: [{ showGridLines: false }],
        pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
    });

    const colCount = headers.length;

    // ── Fila 1: fondo navy de todo el ancho ───────────────────────────────────
    sheet.mergeCells(1, 1, 1, colCount);
    const titleCell = sheet.getCell("A1");
    titleCell.value = title.toUpperCase();
    titleCell.font  = { name: "Calibri", size: 16, bold: true, color: { argb: `FF${WHITE}` } };
    titleCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 36;

    // ── Fila 2: subtítulo ─────────────────────────────────────────────────────
    sheet.mergeCells(2, 1, 2, colCount);
    const subCell = sheet.getCell("A2");
    subCell.value = "Sistema de Inventario JMS — SENA";
    subCell.font  = { name: "Calibri", size: 9, color: { argb: `FF${CYAN}` } };
    subCell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${NAVY}` } };
    subCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(2).height = 18;

    // ── Fila 3: fecha de generación ───────────────────────────────────────────
    sheet.mergeCells(3, 1, 3, colCount);
    const dateCell = sheet.getCell("A3");
    dateCell.value = `Generado: ${new Date().toLocaleString("es-CO", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })}`;
    dateCell.font  = { name: "Calibri", size: 8, italic: true, color: { argb: `FF${GRAY}` } };
    dateCell.alignment = { horizontal: "right", vertical: "middle" };
    sheet.getRow(3).height = 14;

    // ── Fila 4: espacio ───────────────────────────────────────────────────────
    sheet.getRow(4).height = 6;

    // ── Fila 5: encabezados de columna ────────────────────────────────────────
    const headerRow = sheet.getRow(5);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h;
        cell.font  = { name: "Calibri", size: 10, bold: true, color: { argb: `FF${WHITE}` } };
        cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${PURPLE}` } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
            bottom: { style: "medium", color: { argb: `FF${CYAN}` } },
        };
    });
    headerRow.height = 22;

    // ── Filas de datos ────────────────────────────────────────────────────────
    rows.forEach((rowData, ri) => {
        const dataRow = sheet.getRow(6 + ri);
        const isAlt   = ri % 2 === 1;

        rowData.forEach((val, ci) => {
            const cell = dataRow.getCell(ci + 1);
            cell.value = val ?? "—";
            cell.font  = { name: "Calibri", size: 9 };
            cell.fill  = {
                type: "pattern", pattern: "solid",
                fgColor: { argb: isAlt ? `FF${ROW_ALT}` : `FF${WHITE}` },
            };
            cell.alignment = { horizontal: ci === 0 ? "left" : "center", vertical: "middle" };
            cell.border = {
                bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            };
        });
        dataRow.height = 18;
    });

    // ── Fila final: total de registros ────────────────────────────────────────
    const totalRow = sheet.getRow(6 + rows.length);
    sheet.mergeCells(6 + rows.length, 1, 6 + rows.length, colCount);
    const totalCell = totalRow.getCell(1);
    totalCell.value = `Total de registros: ${rows.length}`;
    totalCell.font  = { name: "Calibri", size: 9, bold: true, color: { argb: `FF${GRAY}` } };
    totalCell.alignment = { horizontal: "right", vertical: "middle" };
    totalRow.height = 16;

    // ── Anchos de columna automáticos ─────────────────────────────────────────
    sheet.columns = headers.map((h, i) => {
        const maxContent = Math.max(
            h.length,
            ...rows.map((r) => String(r[i] ?? "").length),
        );
        return { width: Math.min(Math.max(maxContent + 4, 12), 40) };
    });

    // ── Descargar ─────────────────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }), fileName);
}
