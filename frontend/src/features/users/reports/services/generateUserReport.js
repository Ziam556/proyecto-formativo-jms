import { users } from "../../data/users.js";
import { generateUserPdfReport } from "./generateUserPdfReport.js";
import { generateUserExcelReport } from "./generateUserExcelReport.js";

// Construye headers y rows a partir de los campos activos y los datos
function buildDataset({ data, activeFields }) {
    const headers = activeFields.map((f) => f.label);
    const rows = data.map((user) => activeFields.map((f) => user[f.key] ?? "—"));
    return { headers, rows };
}

export function generateUserReport({ format, activeFields, scope, selectedIds }) {
    // Determinar qué datos usar
    let data;
    if (scope === "selected") {
        data = users.filter((u) => selectedIds.includes(u.id));
    } else {
        data = users;
    }

    if (!data.length) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    const { headers, rows } = buildDataset({ data, activeFields });

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "pdf") {
        generateUserPdfReport({ headers, rows, fileName: `usuarios-${timestamp}.pdf` });
    }

    if (format === "excel") {
        generateUserExcelReport({ headers, rows, fileName: `usuarios-${timestamp}.xlsx` });
    }
}
