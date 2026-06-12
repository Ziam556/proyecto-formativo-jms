import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

import { consumableMaterials } from "../data/consumableMaterials.js";

import {
  DataTable,
  StatsPills,
  ReportDropdown,
  BackButton,
  InputForList,
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

    <div className="min-h-[calc(100vh-64px)] px-6 py-5">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">

        <BackButton to="/dashboard/consumable-material" />

        <h1 className="text-white text-2xl font-bold">
          Lista materiales consumo
        </h1>

      </div>

      {/* CARD GENERAL */}
      <div
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/10
          backdrop-blur-md
          shadow-2xl
          p-6
        "
      >

        {/* STATS */}
        <div className="mb-6">
          <StatsPills stats={statsPills} />
        </div>

        {/* FILTROS + REPORTES */}
        <div className="flex flex-wrap items-end gap-4 mb-6">

          {/* NOMBRE */}
          <div className="w-[320px]">

            <InputForList
              label="Nombre del elemento"
              type="search"
              value={filters.elementName}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  elementName: e.target.value,
                }))
              }
              placeholder="Buscar nombre elemento"
            />

          </div>

          {/* CUENTADANTE */}
          <div className="w-[320px]">

            <InputForList
              label="Cuentadante"
              value={filters.accountHolder}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  accountHolder: e.target.value,
                }))
              }
              placeholder="Ingrese nombre del cuentadante"
            />

          </div>

          {/* ESTADO */}
          <div className="flex flex-col gap-1 w-[320px]">

            <label className="text-sm font-medium text-white">
              Estado
            </label>

            <select
              value={filters.state}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  state: e.target.value,
                }))
              }
              className="
                w-full
                h-[56px]
                rounded-md
                px-4
                bg-white/70
                text-black
                outline-none
              "
            >
              <option value="">
                Selecciona el estado
              </option>

              {uniqueStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}

            </select>

          </div>

          {/* SERIAL */}
          <div className="w-[320px]">

            <InputForList
              label="Serial"
              value={filters.serial}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  serial: e.target.value,
                }))
              }
              placeholder="Ingrese serial"
            />

          </div>

          {/* LIMPIAR */}
          <button
            onClick={clearFilters}
            className="
              h-[56px]
              px-6
              rounded-md
              bg-cyan-700
              hover:bg-cyan-800
              text-white
              font-semibold
              flex
              items-center
              gap-2
              transition
            "
          >
            <SlidersHorizontal size={18} />
            Limpiar filtros
          </button>

          {/* REPORTE TODOS */}
          <div className="mt-[1px]">

            <ReportDropdown
              label="Generar reporte de todos los materiales consumo"
              color="#00304D"
              width={320}
              height={56}
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

          </div>

          {/* REPORTE SELECCIONADOS */}
          <div className="mt-[1px]">

            <ReportDropdown
              label="Generar reporte de material consumo seleccionado"
              color="#00304D"
              width={320}
              height={56}
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