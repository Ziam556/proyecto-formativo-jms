import { useState, useMemo, useEffect } from "react";
import { ClipboardList, Info } from "lucide-react";

import {
  DataTable,
  StatsPills,
  ReportDropdown,
  BackButton,
  Input,
  ClearFiltersButton,
} from "@/shared";

import { listLoansColumns } from "../table/listLoansColumns.jsx";
import { loansReportFields } from "../reports/config/loansReportFields.js";
import { generateLoansReport } from "../reports/services/generateLoansReport.js";
import { getLoans } from "../services/loanService.js";

export default function ListWeLendAssetsPage() {

  const [loans, setLoans]           = useState([]);
  const [loading, setLoading]       = useState(true);

  const [filters, setFilters] = useState({
    user:       "",
    materiales: "",
    id:         "",
  });

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    getLoans()
      .then(setLoans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔎 FILTROS
  const filtered = useMemo(() => {
    return loans.filter((item) => {
      if (
        filters.user &&
        !item.user?.toLowerCase().includes(filters.user.toLowerCase())
      )
        return false;

      if (
        filters.materiales &&
        !item.materiales?.some((m) =>
          m.name.toLowerCase().includes(filters.materiales.toLowerCase())
        )
      )
        return false;

      if (
        filters.id &&
        !String(item.id).toLowerCase().includes(filters.id.toLowerCase())
      )
        return false;

      return true;
    });
  }, [filters, loans]);

  // 📊 STATS
  const statsPills = useMemo(() => [
    { label: "Total",     count: loans.length,                                          color: "#e2e8f0" },
    { label: "Activos",   count: loans.filter((l) => l.status === "activo").length,    color: "#16a34a" },
    { label: "Devueltos", count: loans.filter((l) => l.status === "devuelto").length,  color: "#2563eb" },
    { label: "Cancelados",count: loans.filter((l) => l.status === "cancelado").length, color: "#6b7280" },
  ], [loans]);

  // 🧹 LIMPIAR FILTROS
  const clearFilters = () => setFilters({ user: "", materiales: "", id: "" });

  // 📄 REPORTE SELECCIONADO
  const generateSelectedReport = (format) => {
    const selectedIds = Object.keys(rowSelection)
      .filter((idx) => rowSelection[idx])
      .map((idx) => filtered[Number(idx)]?.id)
      .filter(Boolean);

    if (selectedIds.length === 0) {
      alert("Seleccione al menos un préstamo.");
      return;
    }

    generateLoansReport({
      format,
      selectedFields: loansReportFields,
      scope: "selected",
      selectedIds,
    });
  };

  return (
    <div className="min-h-full px-3 sm:px-6 py-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <BackButton to="/dashboard/loans" />
        <h1 className="text-white text-2xl font-bold">Lista préstamos</h1>
      </div>

      {/* CARD GENERAL */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6">

        {/* TITULO INTERNO */}
        <div className="mb-5">
          <h2 className="text-black flex items-center gap-2 text-[1.1rem] font-bold mb-1">
            <ClipboardList size={26} />
            Préstamos Activos
          </h2>
          <p className="text-black/80 text-sm">
            Listado de todos los préstamos registrados en el sistema.
          </p>
        </div>

        {/* PILLS */}
        <div className="mb-4">
          <StatsPills stats={statsPills} />
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap items-end gap-4 mb-6">

          {/* ID */}
          <div className="flex flex-col gap-1 w-full sm:w-[200px]">
            <label className="text-white text-[0.75rem] font-medium">ID préstamo</label>
            <Input
              name="id"
              value={filters.id}
              onChange={(e) => setFilters((f) => ({ ...f, id: e.target.value }))}
              placeholder="Buscar ID"
            />
          </div>

          {/* Usuario */}
          <div className="flex flex-col gap-1 w-full sm:w-[240px]">
            <label className="text-white text-[0.75rem] font-medium">Usuario</label>
            <Input
              name="user"
              value={filters.user}
              onChange={(e) => setFilters((f) => ({ ...f, user: e.target.value }))}
              placeholder="Buscar usuario"
            />
          </div>

          {/* Limpiar filtros + Reportes */}
          <ClearFiltersButton onClick={clearFilters} />

          <div className="flex flex-row gap-[6px] w-full sm:w-auto flex-wrap">
            <ReportDropdown
              label="Generar reporte de todos los préstamos"
              onPDF={() =>
                generateLoansReport({
                  format: "pdf",
                  selectedFields: loansReportFields,
                  scope: "all",
                })
              }
              onExcel={() =>
                generateLoansReport({
                  format: "excel",
                  selectedFields: loansReportFields,
                  scope: "all",
                })
              }
            />
            <ReportDropdown
              label="Generar reporte del préstamo seleccionado"
              onPDF={() => generateSelectedReport("pdf")}
              onExcel={() => generateSelectedReport("excel")}
            />
          </div>
        </div>

        {/* TABLA */}
        {loading ? (
          <p className="text-black/60 text-sm text-center py-8">Cargando préstamos…</p>
        ) : (
          <div className="rounded-xl overflow-visible">
            <DataTable
              data={filtered}
              columns={listLoansColumns}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
            />
          </div>
        )}

        {/* INFO */}
        <div className="flex items-center gap-2 mt-5 rounded-lg bg-cyan-900/40 border border-cyan-400/20 px-4 py-3 text-cyan-200 text-sm">
          <Info size={16} />
          <p>
            Se muestran materiales devolutivos y de consumo.
            La cantidad sobrante solo aplica para materiales de consumo.
          </p>
        </div>

      </div>
    </div>
  );
}
