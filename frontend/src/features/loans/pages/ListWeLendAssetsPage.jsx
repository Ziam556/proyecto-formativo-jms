import { useState, useMemo } from "react";
import { ClipboardList, Info, SlidersHorizontal } from "lucide-react";

import { ListLoans } from "../data/ListLoans.js";

import {
  DataTable,
  StatsPills,
  ReportDropdown,
  BackButton,
  Input,
} from "@/shared";

import { listLoansColumns } from "../table/listLoansColumns.jsx";
import { loansReportFields } from "../reports/config/loansReportFields.js";
import { generateLoansReport } from "../reports/services/generateLoansReport.js";

export default function ListWeLendAssetsPage() {

  const [filters, setFilters] = useState({
    user: "",
    materiales: "",
    id: "",
  });

  const [rowSelection, setRowSelection] = useState({});

  // 🔎 FILTROS
  const filtered = useMemo(() => {

    return ListLoans.filter((item) => {

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

  }, [filters]);

  // 📊 STATS
  const statsPills = useMemo(() => {

    return [
      {
        label: "Total",
        count: ListLoans.length,
        color: "#e2e8f0",
      },
    ];

  }, []);

  // 🧹 LIMPIAR FILTROS
  const clearFilters = () => {

    setFilters({
      user: "",
      materiales: "",
      id: "",
    });

  };

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

    <div className="min-h-[calc(100vh-64px)] px-3 sm:px-6 py-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">

        <BackButton to="/dashboard/loans" />

        <h1 className="text-white text-2xl font-bold">
          Lista préstamos
        </h1>

      </div>

      {/* CARD GENERAL */}
      <div className="
        w-full
        rounded-2xl
        border
        border-white/10
        bg-white/10
        backdrop-blur-md
        shadow-2xl
        p-6
      ">

        {/* TITULO INTERNO */}
        <div className="mb-5">

          <h2 className="
            text-black
            flex
            items-center
            gap-2
            text-[1.1rem]
            font-bold
            mb-1
          ">
            <ClipboardList size={26} />
            Prestamos Activos
          </h2>

          <p className="text-black/80 text-sm">
            Listado de todos los prestamos que se encuentran activos 
          </p>

        </div>

  
        {/* FILTROS */}
        <div className="flex flex-wrap items-end gap-4 mb-6">

          {/* ID */}
          <div className="flex flex-col gap-1 w-full sm:w-[320px]">
            <label className="text-white text-[0.75rem] font-medium">ID préstamo</label>
            <Input
              name="id"
              value={filters.id}
              onChange={(e) => setFilters((f) => ({ ...f, id: e.target.value }))}
              placeholder="Buscar ID"
            />
          </div>

          {/* REPORTE TODOS */}
          <ReportDropdown
            label="Generar reporte de todos los préstamos"
            color="#00304D"
            width={320}
            height={56}
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

          {/* REPORTE SELECCIONADOS */}
          <ReportDropdown
            label="Generar reporte del prestamo seleccionado"
            color="#00304D"
            width={320}
            height={56}
            onPDF={() => generateSelectedReport("pdf")}
            onExcel={() => generateSelectedReport("excel")}
          />

        </div>

        {/* TABLA */}
        <div className="rounded-xl overflow-visible">

          <DataTable
            data={filtered}
            columns={listLoansColumns}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />

        </div>

        {/* INFO */}
        <div className="
          flex
          items-center
          gap-2
          mt-5
          rounded-lg
          bg-cyan-900/40
          border
          border-cyan-400/20
          px-4
          py-3
          text-cyan-200
          text-sm
        ">

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