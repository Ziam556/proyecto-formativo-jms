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
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "16px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <BackButton to="/dashboard/returnable-material" />
        <h1 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
          Lista materiales devolutivo
        </h1>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: "6px" }}>
        <StatsPills stats={statsPills} />
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "12px", flexWrap: "wrap" }}>

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

        {/* Estado — select nativo con el mismo estilo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "320px" }}>
          <label style={{ fontSize: "0.75rem", color: "#c4b5fd", fontWeight: 500 }}>Estado</label>
          <select
            value={filters.state}
            onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
            style={{
              width: "320px",
              height: "56px",
              background: "rgba(217,217,217,0.54)",
              border: "none",
              borderRadius: "4px",
              padding: "0 14px",
              fontSize: "0.85rem",
              color: "#111",
              outline: "none",
              boxSizing: "border-box",
              backdropFilter: "blur(4px)",
            }}
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
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>

          <button
            onClick={clearFilters}
            style={{ width: "189px", 
              height: "56px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "6px", borderRadius: "4px", 
              background: "#0e7490", 
              border: "none", color: "#fff", 
              fontSize: "0.82rem", 
              fontWeight: 600, 
              cursor: "pointer", 
              flexShrink: 0, 
              boxSizing: "border-box" }}
          >
            <SlidersHorizontal size={15} />
            Limpiar Filtros
          </button>

          {/* Reportes apilados */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
