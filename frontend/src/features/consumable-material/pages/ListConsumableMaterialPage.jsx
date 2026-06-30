import { useState, useMemo, useEffect } from "react";

import { getConsumableMaterials } from "../services/consumableMaterialService.js";
import { normalizeConsumableMaterials } from "../utils/normalizeConsumableMaterial.js";
import { translateStatesInList } from "../utils/stateLabels.js";

import {
  DataTable,
  StatsPills,
  ReportDropdown,
  BackButton,
  Input,
  Select,
  ClearFiltersButton,
} from "@/shared";

import { consumableMaterialColumns } from "../table/consumableMaterialColumns.js";

import { consumableMaterialReportFields } from "../reports/config/consumableMaterialReportFields.js";

import { generateConsumableMaterialReport } from "../reports/services/generateConsumableMaterialReport.js";

// ─────────────────────────────────────────────
const STATE_DOT = {
  Disponible: "#16a34a",
  "No Disponible": "#d97706",
  Prestamo: "#2563eb",
  Baja: "#ef4444",
  Traslado: "#9333ea",
  Mantenimiento: "#6b7280",
};

export default function ListConsumableMaterialPage() {

  // 📦 DATOS REALES (antes: import { consumableMaterials } from "../data/ConsumableMaterials.js")
  const [consumableMaterials, setConsumableMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getConsumableMaterials()
      .then((rows) => normalizeConsumableMaterials(rows))
      .then((normalized) => translateStatesInList(normalized))
      .then((translated) => {
        if (!active) return;
        setConsumableMaterials(translated);
        setLoadError(null);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const [filters, setFilters] = useState({
    elementName: "",
    accountHolder: "",
    state: "",
  });

  const [rowSelection, setRowSelection] = useState({});
  const [reportCols, setReportCols]     = useState({});

  // 🔎 FILTROS
  const filtered = useMemo(() => {

    return consumableMaterials.filter((item) => {

      if (
        filters.elementName &&
        !item.elementName
          ?.toLowerCase()
          .includes(filters.elementName.toLowerCase())
      )
        return false;

      if (
        filters.accountHolder &&
        !item.accountHolder
          ?.toLowerCase()
          .includes(filters.accountHolder.toLowerCase())
      )
        return false;

      if (
        filters.state &&
        item.state !== filters.state
      )
        return false;

      return true;

    });

  }, [filters, consumableMaterials]);

  // 📊 STATS
  const statsPills = useMemo(() => {

    const pills = [
      {
        label: "Total",
        count: consumableMaterials.length,
        color: "#e2e8f0",
      },
    ];

    Object.entries(STATE_DOT).forEach(([state, color]) => {

      pills.push({
        label: state,
        count: consumableMaterials.filter(
          (r) => r.state === state
        ).length,
        color,
      });

    });

    return pills;

  }, [consumableMaterials]);

  // 📋 ESTADOS
  const uniqueStates = useMemo(
    () => [...new Set(consumableMaterials.map((r) => r.state))],
    [consumableMaterials]
  );

  // 🧹 LIMPIAR FILTROS
  const clearFilters = () => {

    setFilters({
      elementName: "",
      accountHolder: "",
      state: "",
    });

  };

  // Campos activos según toggles de la tabla
  const activeFields = useMemo(
    () => consumableMaterialReportFields.filter((f) => reportCols[f.key] !== false),
    [reportCols]
  );

  // REPORTE SELECCIONADO
  const generateSelectedReport = (format) => {

    const selectedIds = Object.keys(rowSelection)
      .filter((idx) => rowSelection[idx])
      .map((idx) => filtered[Number(idx)]?.id)
      .filter(Boolean);

    if (selectedIds.length === 0) {
      alert("Seleccione al menos un material.");
      return;
    }

    generateConsumableMaterialReport({
      format,
      selectedFields: activeFields,
      scope: "selected",
      selectedIds,
      materials: consumableMaterials,
    });

  };

  return (

    <div className="min-h-full px-3 sm:px-6 py-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">

        <BackButton to="/dashboard/consumable-material" />

        <h1 className="text-white text-[1rem] sm:text-2xl font-bold">
          Lista materiales consumo
        </h1>

      </div>

      {/* CARD GENERAL */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4 sm:p-6">

        {loadError && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-400/30 px-4 py-3 text-red-200 text-sm">
            No se pudieron cargar los materiales: {loadError}
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 overflow-x-auto">
          <StatsPills stats={statsPills} />
        </div>

        {/* FILTROS + REPORTES */}
        <div className="flex flex-wrap items-end gap-4 mb-6">

          <div className="flex flex-col gap-1 w-full sm:w-[320px]">
            <label className="text-white text-[0.75rem] font-medium">Nombre del elemento</label>
            <Input
              name="elementName"
              value={filters.elementName}
              onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
              placeholder="Buscar nombre elemento"
            />
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-[320px]">
            <label className="text-white text-[0.75rem] font-medium">Cuentadante</label>
            <Input
              name="accountHolder"
              value={filters.accountHolder}
              onChange={(e) => setFilters((f) => ({ ...f, accountHolder: e.target.value }))}
              placeholder="Ingrese nombre del cuentadante"
            />
          </div>

          {/* ESTADO */}
          <div className="flex flex-col gap-1 w-full sm:w-[320px]">
            <label className="text-white text-[0.75rem] font-medium">Estado</label>
            <Select
              name="state"
              value={filters.state}
              options={uniqueStates.map((s) => ({ id: s, label: s }))}
              onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
              placeholder="Selecciona el estado"
            />
          </div>

          {/* Limpiar filtros + Reportes */}
          <ClearFiltersButton onClick={clearFilters} />

          <div className="flex flex-row gap-[6px] w-full sm:w-auto flex-wrap">
            <ReportDropdown
              label="Generar reporte de todos los materiales consumo"
              onPDF={() =>
                generateConsumableMaterialReport({
                  format: "pdf",
                  selectedFields: activeFields,
                  scope: "all",
                  materials: consumableMaterials,
                })
              }
              onExcel={() =>
                generateConsumableMaterialReport({
                  format: "excel",
                  selectedFields: activeFields,
                  scope: "all",
                  materials: consumableMaterials,
                })
              }
            />
            <ReportDropdown
              label="Generar reporte de material consumo seleccionado"
              onPDF={() => generateSelectedReport("pdf")}
              onExcel={() => generateSelectedReport("excel")}
            />
          </div>

        </div>

        {/* TABLA */}
        <div className="rounded-xl overflow-visible">

          {loading ? (
            <p className="text-white/70 text-sm px-2 py-4">Cargando materiales...</p>
          ) : (
            <DataTable
              data={filtered}
              columns={consumableMaterialColumns}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              onReportColsChange={setReportCols}
            />
          )}

        </div>

      </div>

    </div>
  );
}