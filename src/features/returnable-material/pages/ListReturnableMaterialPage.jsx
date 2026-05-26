import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { returnableMaterials } from "../data/returnableMaterials.js";
import { DataTable, StatsPills, ReportDropdown, BackButton, InputForList } from "@/shared";
import { returnableMaterialColumns } from "../table/returnableMaterialColumns";

// ─── Colores de estado para pills ─────────────────────────────────────────────
const STATE_DOT = {
  Disponible:      "#16a34a",
  "No Disponible": "#d97706",
  Prestamo:        "#2563eb",
  Baja:            "#ef4444",
  Traslado:        "#9333ea",
  Mantenimiento:   "#6b7280",
};


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ListReturnableMaterialPage() {
  // Filtros
  const [filters, setFilters] = useState({
    elementName: "",
    accountHolder: "",
    state: "",
    serial: "",
  });

  // Datos filtrados que se pasan a la tabla
  const filtered = useMemo(() => {
    return returnableMaterials.filter((item) => {
      if (filters.elementName   && !item.elementName?.toLowerCase().includes(filters.elementName.toLowerCase()))   return false;
      if (filters.accountHolder && !item.accountHolder?.toLowerCase().includes(filters.accountHolder.toLowerCase())) return false;
      if (filters.state         && item.state !== filters.state)                                                    return false;
      if (filters.serial        && !String(item.serial).includes(filters.serial))                                  return false;
      return true;
    });
  }, [filters]);

  // Stats pills
  const statsPills = useMemo(() => {
    const pills = [{ label: "Total", count: returnableMaterials.length, color: "#e2e8f0" }];
    Object.entries(STATE_DOT).forEach(([state, color]) => {
      pills.push({ label: state, count: returnableMaterials.filter((r) => r.state === state).length, color });
    });
    return pills;
  }, []);

  // Opciones únicas para select de estado
  const uniqueStates = useMemo(
    () => [...new Set(returnableMaterials.map((r) => r.state))],
    []
  );

  const clearFilters = () =>
    setFilters({ elementName: "", accountHolder: "", state: "", serial: "" });

  return (
    <div className="min-h-[calc(100vh-64px)] py-4 px-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BackButton to="/dashboard/returnable-material" />
        <h1 className="text-white text-[1.2rem] font-bold m-0">
          Lista materiales devolutivo
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-[6px]">
        <StatsPills stats={statsPills} />
      </div>

      {/* Filtros */}
      <div className="flex gap-[10px] items-end mb-3 flex-wrap">

        {/* Nombre del elemento */}
        <InputForList
          label="Nombre del elemento"
          type="search"
          value={filters.elementName}
          onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
          placeholder="Buscar nombre elemento"
        />

        {/* Cuentadante */}
        <InputForList
          label="Cuentadante"
          value={filters.accountHolder}
          onChange={(e) => setFilters((f) => ({ ...f, accountHolder: e.target.value }))}
          placeholder="Ingrese nombre del cuentadante"
        />

        {/* Estado — select nativo con el mismo estilo que los InputForList */}
        <div className="flex flex-col gap-1 w-[320px]">
          <label className="text-xs text-[#c4b5fd] font-medium">Estado</label>
          <select
            value={filters.state}
            onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
            className="w-[320px] h-14 bg-[rgba(217,217,217,0.54)] border-0 rounded text-[0.85rem] text-[#111] outline-none box-border backdrop-blur-sm px-[14px]"
          >
            <option value="">Selecciona el estado</option>
            {uniqueStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Serial */}
        <InputForList
          label="Serial"
          value={filters.serial}
          onChange={(e) => setFilters((f) => ({ ...f, serial: e.target.value }))}
          placeholder="Ingrese número de serial"
        />

        {/* Limpiar filtros + Reportes */}
        <div className="flex gap-[10px] items-end">

          <button
            onClick={clearFilters}
            className="w-[189px] h-14 flex items-center justify-center gap-[6px] rounded border-0 bg-[#0e7490] text-white text-[0.82rem] font-semibold cursor-pointer shrink-0 box-border"
          >
            <SlidersHorizontal size={15} />
            Limpiar Filtros
          </button>

          {/* Reportes apilados */}
          <div className="flex flex-col gap-[6px]">
            <ReportDropdown
              label="Generar reporte de todos los materiales devolutivos"
              color="#00304D"
              width={280}
              height={70}
            />
            <ReportDropdown
              label="Generar reporte de material devolutivo seleccionado"
              color="#00304D"
              width={280}
              height={70}
            />
          </div>

        </div>

      </div>

      {/* Tabla */}
      <DataTable data={filtered} columns={returnableMaterialColumns} />

    </div>
  );
}
