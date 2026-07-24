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

export default function DataTable({
    data = [],
    columns: colDefs = [],
    rowSelection: externalRowSelection,
    onRowSelectionChange: externalOnRowSelectionChange,
    initialPageSize = 5,
    onReportColsChange,
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

    const rowSelection = externalRowSelection ?? internalRowSelection;
    const onRowSelectionChange = externalOnRowSelectionChange ?? setInternalRowSelection;

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
        ...colDefs.map((col) => ({
            id: col.id,
            accessorKey: col.accessor ?? undefined,
            size: col.width ? undefined : undefined,
            meta: { width: col.width },
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
                if (col.format === "link")     return (
                    <a href="#" className="text-[#93c5fd] underline text-[0.82rem]">
                        Ver ficha
                    </a>
                );
                return value ?? "—";
            },
        })),
    ], [colDefs, reportCols]);

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
    const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const toRow   = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-[#bdbdbd] bg-[#E9E9E9]">
                <table className="w-full border-collapse table-fixed">
                    <colgroup>
                        <col className="w-[50px]" />
                        {colDefs.map((col) => (
                            <col key={col.id} style={{ width: col.width ?? "auto" }} />
                        ))}
                    </colgroup>
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="p-[8px_10px] bg-[#D1D1D1] text-black text-[0.8rem] font-semibold border-b border-[#bdbdbd] sticky top-0 z-10 text-left">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
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
                                    className={`hover:bg-[#dcd6f0] transition-colors duration-100 ${i % 2 === 0 ? "bg-[#E9E9E9]" : "bg-[#f0f0f0]"}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-[8px_10px] text-[0.82rem] text-[#3D3D3D] border-b border-[#d5d5d5] overflow-hidden">
                                            <div className="truncate whitespace-nowrap" title={typeof cell.getValue() === "string" ? cell.getValue() : undefined}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4 text-[#e2e8f0] text-[0.85rem]">
                <span>Page</span>
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
