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
import { formatDate } from "../utils/formatDate";

const formatCurrency = (v) =>
    Number(v).toLocaleString("es-CO", { minimumFractionDigits: 0 });

function formatCellValue(col, row) {
    const value = col.accessor ? row[col.accessor] : null;
    if (col.format === "currency") return formatCurrency(value);
    if (col.format === "date")     return formatDate(value);
    if (col.format === "state")    return <StateChip value={value} />;
    if (col.format === "link") {
        if (!value) return <span className="text-[0.78rem] text-[#9ca3af]">—</span>;
        const href = value.startsWith("http") ? value : `http://localhost:4000/${value}`;
        return (
            <a href={href} target="_blank" rel="noreferrer"
               className="text-[#2563eb] underline text-[0.82rem]" onClick={(e) => e.stopPropagation()}>
                Ver ficha
            </a>
        );
    }
    if (col.renderCell) return col.renderCell(row);
    return value ?? "—";
}

// ── Vista móvil: tarjeta por fila ───────────────────────────────────────────
function MobileCards({ data, colDefs, pageRows, rowSelection, onRowSelectionChange, onRowClick }) {
    const dataCols  = colDefs.filter((c) => c.id !== "actions");
    const actionCol = colDefs.find((c) => c.id === "actions");

    // Primera columna de texto = título de la card
    const titleCol  = dataCols.find((c) => !c.format) ?? dataCols[0];
    // Columna de estado
    const stateCol  = dataCols.find((c) => c.format === "state");
    // Resto de columnas (sin título ni estado)
    const restCols  = dataCols.filter((c) => c.id !== titleCol?.id && c.id !== stateCol?.id);

    return (
        <div className="flex flex-col gap-3">
            {pageRows.length === 0 && (
                <p className="text-center text-[0.85rem] text-[#9ca3af] py-6">Sin resultados</p>
            )}
            {pageRows.map((row, i) => {
                const original = row.original;
                const isSelected = rowSelection[row.id] ?? false;
                return (
                    <div
                        key={row.id}
                        onClick={() => onRowClick?.(original)}
                        className={`rounded-xl border border-[#bdbdbd] bg-[#E9E9E9] p-3 shadow-sm transition-colors ${onRowClick ? "cursor-pointer active:bg-[#c9c0e8]" : ""} ${isSelected ? "ring-2 ring-[#7c3aed]" : ""}`}
                    >
                        {/* Cabecera de la card: checkbox + título + estado */}
                        <div className="flex items-start gap-2 mb-2">
                            <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={isSelected}
                                    onChange={row.getToggleSelectedHandler()}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[0.85rem] text-[#1e1b4b] truncate">
                                    {titleCol ? formatCellValue(titleCol, original) : "—"}
                                </p>
                            </div>
                            {stateCol && (
                                <div className="shrink-0">
                                    {formatCellValue(stateCol, original)}
                                </div>
                            )}
                        </div>

                        {/* Campos en grid 2 columnas */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.78rem]">
                            {restCols.map((col) => (
                                <div key={col.id} className="min-w-0">
                                    <span className="text-[#6b7280] font-medium">{col.label}: </span>
                                    <span className="text-[#3D3D3D] break-words">
                                        {formatCellValue(col, original)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Acciones al pie */}
                        {actionCol && (
                            <div className="mt-2 pt-2 border-t border-[#d5d5d5] flex justify-end"
                                 onClick={(e) => e.stopPropagation()}>
                                {actionCol.renderCell(original)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function DataTable({
    data = [],
    columns: colDefs = [],
    rowSelection: externalRowSelection,
    onRowSelectionChange: externalOnRowSelectionChange,
    initialPageSize = 5,
    onReportColsChange,
    onRowClick,
}) {
    const [reportCols, setReportColsInternal] = useState(
        Object.fromEntries(colDefs.map((c) => [c.id, true]))
    );

    const setReportCols = (updater) => {
        setReportColsInternal((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            onReportColsChange?.(next);
            return next;
        });
    };

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });
    const [internalRowSelection, setInternalRowSelection] = useState({});

    const rowSelection        = externalRowSelection        ?? internalRowSelection;
    const onRowSelectionChange = externalOnRowSelectionChange ?? setInternalRowSelection;

    const SELECT_WIDTH_PERCENT = 4;
    const definedPercents = colDefs
        .map((c) => (typeof c.width === "string" && c.width.trim().endsWith("%") ? parseFloat(c.width) : null))
        .filter((w) => w != null && !Number.isNaN(w));
    const sumDefinedPercents = definedPercents.reduce((acc, w) => acc + w, 0);
    const hasPercentWidths = sumDefinedPercents > 0;
    const scale = hasPercentWidths ? (100 - SELECT_WIDTH_PERCENT) / sumDefinedPercents : 1;

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
            size: 50,
        },
        ...colDefs.map((col) => {
            const isPercent = typeof col.width === "string" && col.width.trim().endsWith("%");
            const normalizedWidth = isPercent
                ? `${(parseFloat(col.width) * scale).toFixed(2)}%`
                : col.width;
            return {
                id: col.id,
                accessorKey: col.accessor ?? undefined,
                meta: { width: normalizedWidth },
                header: () => col.noToggle
                    ? <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{col.label}</span>
                    : (
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
                    if (col.format === "date")     return formatDate(value);
                    if (col.format === "link") {
                        if (!value) return <span className="text-[0.78rem] text-[#9ca3af]">—</span>;
                        const href = value.startsWith("http") ? value : `http://localhost:4000/${value}`;
                        return (
                            <a href={href} target="_blank" rel="noreferrer"
                               className="text-[#93c5fd] underline text-[0.82rem]">
                                Ver ficha
                            </a>
                        );
                    }
                    return value ?? "—";
                },
            };
        }),
    ], [colDefs, reportCols, scale]);

    const table = useReactTable({
        data,
        columns,
        state: { pagination, rowSelection },
        onPaginationChange: setPagination,
        onRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = data.length;
    const fromRow   = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const toRow     = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <>
            {/* ── Vista DESKTOP: tabla ── */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-[#bdbdbd] bg-[#E9E9E9]">
                <table className="border-collapse w-full table-fixed">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => {
                                    const metaWidth = header.column.columnDef.meta?.width;
                                    return (
                                        <th
                                            key={header.id}
                                            className="p-[8px_10px] bg-[#D1D1D1] text-black text-[0.8rem] font-semibold border-b border-[#bdbdbd] sticky top-0 z-10 text-left whitespace-normal break-words"
                                            style={{
                                                width: header.column.id === "select" ? (hasPercentWidths ? `${SELECT_WIDTH_PERCENT}%` : 40) : metaWidth,
                                                minWidth: header.column.id === "select" ? 40 : 56,
                                            }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-[0.82rem] text-[#9ca3af] border-b border-[#d5d5d5] text-center">
                                    Sin resultados
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, i) => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={`transition-colors duration-100 ${i % 2 === 0 ? "bg-[#E9E9E9]" : "bg-[#f0f0f0]"} ${onRowClick ? "cursor-pointer hover:bg-[#c9c0e8]" : "hover:bg-[#dcd6f0]"}`}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const isInteractive = cell.column.id === "select" || cell.column.id === "actions";
                                        return (
                                            <td
                                                key={cell.id}
                                                onClick={isInteractive ? (e) => e.stopPropagation() : undefined}
                                                className="p-[8px_10px] text-[0.82rem] text-[#3D3D3D] border-b border-[#d5d5d5]"
                                            >
                                                <div className="truncate" style={{ maxWidth: "100%" }}
                                                     title={typeof cell.getValue() === "string" ? cell.getValue() : undefined}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Vista MÓVIL: cards ── */}
            <div className="md:hidden">
                <MobileCards
                    data={data}
                    colDefs={colDefs}
                    pageRows={table.getRowModel().rows}
                    rowSelection={rowSelection}
                    onRowSelectionChange={onRowSelectionChange}
                    onRowClick={onRowClick}
                />
            </div>

            {/* ── Paginación ── */}
            <div className="flex items-center justify-center gap-3 mt-4 text-[#e2e8f0] text-[0.85rem] flex-wrap">
                <span>Página</span>
                <select
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-md bg-[rgba(30,20,60,0.8)] text-white border border-white/20 text-[0.82rem]"
                >
                    {[5, 10, 25, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                {[
                    { label: "|‹", fn: () => table.setPageIndex(0),                         can: table.getCanPreviousPage() },
                    { label: "‹",  fn: () => table.previousPage(),                          can: table.getCanPreviousPage() },
                    { label: "›",  fn: () => table.nextPage(),                              can: table.getCanNextPage() },
                    { label: "›|", fn: () => table.setPageIndex(table.getPageCount() - 1), can: table.getCanNextPage() },
                ].map(({ label, fn, can }) => (
                    <button key={label} onClick={fn} disabled={!can}
                        className={`bg-transparent border-0 text-[1rem] ${can ? "text-white cursor-pointer" : "text-[#4b5563] cursor-default"}`}>
                        {label}
                    </button>
                ))}

                <span className="text-[#9ca3af]">
                    {totalRows > 0 ? `${fromRow} - ${toRow} de ${totalRows}` : "0 resultados"}
                </span>
            </div>
        </>
    );
}
