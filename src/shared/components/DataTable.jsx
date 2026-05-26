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

// Clases de cabecera y celda — se usan como className en th y td
const thClass = "p-[8px_10px] bg-[#D1D1D1] text-black text-[0.8rem] font-semibold border-b border-[#bdbdbd] sticky top-0 z-10";
const tdClass = "p-[8px_10px] text-[0.82rem] text-[#3D3D3D] border-b border-[#d5d5d5] whitespace-nowrap";

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
                    <a href="#" className="text-[#93c5fd] underline text-[0.82rem]">
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
            <div className="overflow-x-auto rounded-xl border border-[#bdbdbd] bg-[#E9E9E9]">
                <table className="w-full border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className={thClass}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className={`${tdClass} text-center p-8 text-gray-400`}>
                                    Sin resultados
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, i) => (
                                /* odd/even para filas alternadas, hover con Tailwind */
                                <tr
                                    key={row.id}
                                    className={`hover:bg-[#dcd6f0] transition-colors duration-100 ${i % 2 === 0 ? "bg-[#E9E9E9]" : "bg-[#f0f0f0]"}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className={tdClass}>
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
            <div className="flex items-center justify-center gap-3 mt-4 text-[#e2e8f0] text-[0.85rem]">
                <span>Page</span>
                <select
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-md bg-[rgba(30,20,60,0.8)] text-white border border-white/20 text-[0.82rem]"
                >
                    {[10, 25, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                {[
                    { label: "|‹", fn: () => table.setPageIndex(0),                          can: table.getCanPreviousPage() },
                    { label: "‹",  fn: () => table.previousPage(),                           can: table.getCanPreviousPage() },
                    { label: "›",  fn: () => table.nextPage(),                               can: table.getCanNextPage() },
                    { label: "›|", fn: () => table.setPageIndex(table.getPageCount() - 1),  can: table.getCanNextPage() },
                ].map(({ label, fn, can }) => (
                    <button
                        key={label}
                        onClick={fn}
                        disabled={!can}
                        className="bg-transparent border-0 text-[1rem] disabled:text-gray-600 text-white disabled:cursor-default cursor-pointer"
                    >
                        {label}
                    </button>
                ))}

                <span className="text-gray-400">
                    {totalRows > 0 ? `${fromRow} - ${toRow} de ${totalRows}` : "0 resultados"}
                </span>
            </div>
        </>
    );
}
