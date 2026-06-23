import { useState, useMemo } from "react";

import { consumableMaterials } from "../data/ConsumableMaterials.js";

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

  const [filters, setFilters] = useState({
    elementName: "",
    accountHolder: "",
    state: "",
    serial: "",
  });

  const [rowSelection, setRowSelection] = useState({});

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

      if (
        filters.serial &&
        !String(item.serial).includes(filters.serial)
      )
        return false;

      return true;

    });

  }, [filters]);

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

  }, []);

  // 📋 ESTADOS
  const uniqueStates = useMemo(
    () => [...new Set(consumableMaterials.map((r) => r.state))],
    []
  );

  // 🧹 LIMPIAR FILTROS
  const clearFilters = () => {

    setFilters({
      elementName: "",
      accountHolder: "",
      state: "",
      serial: "",
    });

  };

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
      selectedFields: consumableMaterialReportFields,
      scope: "selected",
      selectedIds,
    });

  };

  return (

    <div className="min-h-[calc(100vh-64px)] px-3 sm:px-6 py-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">

        <BackButton to="/dashboard/consumable-material" />

        <h1 className="text-white text-[1rem] sm:text-2xl font-bold">
          Lista materiales consumo
        </h1>

      </div>

      {/* CARD GENERAL */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4 sm:p-6">

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

          <div className="flex flex-col gap-1 w-full sm:w-[320px]">
            <label className="text-white text-[0.75rem] font-medium">Serial</label>
            <Input
              name="serial"
              value={filters.serial}
              onChange={(e) => setFilters((f) => ({ ...f, serial: e.target.value }))}
              placeholder="Ingrese serial"
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
                  selectedFields: consumableMaterialReportFields,
                  scope: "all",
                })
              }
              onExcel={() =>
                generateConsumableMaterialReport({
                  format: "excel",
                  selectedFields: consumableMaterialReportFields,
                  scope: "all",
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

          <DataTable
            data={filtered}
            columns={consumableMaterialColumns}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />

        </div>

      </div>

    </div>
  );
}