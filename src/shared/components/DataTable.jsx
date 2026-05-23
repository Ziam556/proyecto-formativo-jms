// Tabla reutilizable con paginación, selección de filas y toggle de columnas.
// La página padre se encarga de filtrar los datos y pasarlos listos.
// Props: data (array ya filtrado), columns ([{ id, label, accessor, format?, renderCell? }])

import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import Checkbox from "./Checkbox";
import ColumnToggle from "./ColumnToggle";
import StateChip from "./StateChip";

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatCurrency = (v) =>
    Number(v).toLocaleString("es-CO", { minimumFractionDigits: 0 });

// ─── Estilos ──────────────────────────────────────────────────────────────────
const thStyle = {
    padding: "8px 10px",
    background: "#D1D1D1",
    color: "#000000",
    fontSize: "0.8rem",
    fontWeight: 600,
    borderBottom: "1px solid #bdbdbd",
    position: "sticky",
    top: 0,
    zIndex: 10,
};

const tdStyle = {
    padding: "8px 10px",
    fontSize: "0.82rem",
    color: "#3D3D3D",
    background: "#E9E9E9",
    borderBottom: "1px solid #d5d5d5",
    whiteSpace: "nowrap",
};

// ─── Componente ───────────────────────────────────────────────────────────────
//
// Props:
//   data     — array de objetos ya filtrados
//   columns  — [{ id, label, accessor, format?, renderCell? }]
//              format: 'currency' | 'state' | 'link'
//              renderCell: (row) => ReactNode
//
export default function DataTable({ data = [], columns: colDefs = [] }) {
    // Estado de columnas para reporte (ColumnToggle en headers)
    const [reportCols, setReportCols] = useState(
        Object.fromEntries(colDefs.map((c) => [c.id, true]))
    );

    // Selección de filas
    const [rowSelection, setRowSelection] = useState({});

    // Paginación
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });

    // Columnas react-table
    const columns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 40,
        },
        ...colDefs.map((col) => ({
            id: col.id,
            accessorKey: col.accessor ?? undefined,
            header: () => (
                <ColumnToggle
                    label={col.label}
                    active={reportCols[col.id]}
                    onChange={(val) =>
                        setReportCols((prev) => ({ ...prev, [col.id]: val }))
                    }
                />
            ),
            cell: ({ row }) => {
                if (col.renderCell) return col.renderCell(row.original);
                const value = col.accessor ? row.original[col.accessor] : null;
                if (col.format === "currency") return formatCurrency(value);
                if (col.format === "state")    return <StateChip value={value} />;
                if (col.format === "link")     return (
                    <a href="#" style={{ color: "#93c5fd", textDecoration: "underline", fontSize: "0.82rem" }}>
                        Ver ficha
                    </a>
                );
                return value ?? "—";
            },
        })),
    ], [colDefs, reportCols]);

    // Instancia de react-table
    const table = useReactTable({
        data,
        columns,
        state: { pagination, rowSelection },
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = data.length;
    const fromRow  = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const toRow    = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <>
            {/* Tabla */}
            <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #bdbdbd", background: "#E9E9E9" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} style={thStyle}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ ...tdStyle, textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                                    Sin resultados
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, i) => (
                                <tr
                                    key={row.id}
                                    style={{ background: i % 2 === 0 ? "#E9E9E9" : "#f0f0f0" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#dcd6f0"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#E9E9E9" : "#f0f0f0"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} style={tdStyle}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "16px", color: "#e2e8f0", fontSize: "0.85rem" }}>
                <span>Page</span>
                <select
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(30,20,60,0.8)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.82rem" }}
                >
                    {[10, 25, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                {[
                    { label: "|‹", fn: () => table.setPageIndex(0),                          can: table.getCanPreviousPage() },
                    { label: "‹",  fn: () => table.previousPage(),                           can: table.getCanPreviousPage() },
                    { label: "›",  fn: () => table.nextPage(),                               can: table.getCanNextPage() },
                    { label: "›|", fn: () => table.setPageIndex(table.getPageCount() - 1),  can: table.getCanNextPage() },
                ].map(({ label, fn, can }) => (
                    <button key={label} onClick={fn} disabled={!can}
                        style={{ background: "none", border: "none", color: can ? "#fff" : "#4b5563", cursor: can ? "pointer" : "default", fontSize: "1rem" }}>
                        {label}
                    </button>
                ))}

                <span style={{ color: "#9ca3af" }}>
                    {totalRows > 0 ? `${fromRow} - ${toRow} de ${totalRows}` : "0 resultados"}
                </span>
            </div>
        </>
    );
}
