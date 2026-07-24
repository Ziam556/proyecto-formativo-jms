import { useState, useMemo, useEffect } from "react";
import { getReturnableMaterials } from "../services/returnableMaterialService.js";
import { normalizeReturnableMaterials } from "../utils/normalizeReturnableMaterial.js";
import { translateStatesInList } from "@/features/consumable-material/utils/stateLabels.js";
import { DataTable, StatsPills, ReportDropdown, BackButton, Input, Select, ClearFiltersButton } from "@/shared";
import { getReturnableMaterialColumns } from "../table/returnableMaterialColumns";
import { returnableMaterialReportFields } from "../reports/config/returnableMaterialReportFields.js";
import { generateReturnableMaterialReport } from "../reports/services/generateReturnableMaterialReport.js";

// ─── Colores de estado para pills ─────────────────────────────────────────────
const STATE_DOT = {
  Disponible:       "#16a34a",
  "No disponible":  "#d97706",
  "En préstamo":    "#2563eb",
  Baja:             "#ef4444",
  Traslado:         "#9333ea",
  Mantenimiento:    "#6b7280",
};


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ListReturnableMaterialPage() {

  // Datos del backend
  const [returnableMaterials, setReturnableMaterials] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadMaterials = () => {
    setLoading(true);
    getReturnableMaterials()
      .then((rows) => normalizeReturnableMaterials(rows))
      .then((normalized) => translateStatesInList(normalized))
      .then((translated) => {
        setReturnableMaterials(translated);
        setLoadError(null);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMaterials(); }, []);

  // Filtros
  const [filters, setFilters] = useState({
    elementName: "",
    accountHolder: "",
    state: "",
    serial: "",
  });

  const [rowSelection, setRowSelection] = useState({});
  const [reportCols, setReportCols]     = useState({});

  // Datos filtrados que se pasan a la tabla
  const filtered = useMemo(() => {
    return returnableMaterials.filter((item) => {
      if (filters.elementName   && !item.elementName?.toLowerCase().includes(filters.elementName.toLowerCase()))   return false;
      if (filters.accountHolder && !item.accountHolder?.toLowerCase().includes(filters.accountHolder.toLowerCase())) return false;
      if (filters.state         && item.state !== filters.state)                                                    return false;
      if (filters.serial        && !String(item.serial).includes(filters.serial))                                  return false;
      return true;
    });
  }, [filters, returnableMaterials]);

  // Stats pills
  const statsPills = useMemo(() => {
    const pills = [{ label: "Total", count: returnableMaterials.length, color: "#e2e8f0" }];
    Object.entries(STATE_DOT).forEach(([state, color]) => {
      pills.push({ label: state, count: returnableMaterials.filter((r) => r.state === state).length, color });
    });
    return pills;
  }, [returnableMaterials]);

  // Opciones únicas para select de estado
  const uniqueStates = useMemo(
    () => [...new Set(returnableMaterials.map((r) => r.state))],
    [returnableMaterials]
  );

  const clearFilters = () =>
    setFilters({ elementName: "", accountHolder: "", state: "", serial: "" });

  // Campos activos según toggles de la tabla
  const activeFields = useMemo(
    () => returnableMaterialReportFields.filter((f) => reportCols[f.key] !== false),
    [reportCols]
  );

  // Reporte de materiales seleccionados
  const generateSelectedReport = (format) => {
    const selectedIds = Object.keys(rowSelection)
      .filter((idx) => rowSelection[idx])
      .map((idx) => filtered[Number(idx)]?.id)
      .filter(Boolean);

    if (selectedIds.length === 0) {
      alert("Seleccione al menos un material.");
      return;
    }

    generateReturnableMaterialReport({
      format,
      selectedFields: activeFields,
      scope: "selected",
      selectedIds,
      materials: returnableMaterials,
    });
  };

  return (
    <div className="min-h-full py-4 px-3 sm:px-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BackButton to="/dashboard/returnable-material" />
        <h1 className="text-white text-[1rem] sm:text-[1.2rem] font-bold m-0">
          Lista materiales devolutivo
        </h1>
      </div>

      {/* Error */}
      {loadError && (
        <div className="mb-4 rounded-lg bg-red-900/40 border border-red-400/30 px-4 py-3 text-red-200 text-sm">
          No se pudieron cargar los materiales: {loadError}
        </div>
      )}

      {/* Stats */}
      <div className="mb-[6px] overflow-x-auto">
        <StatsPills stats={statsPills} />
      </div>

      {/* Filtros */}
      <div className="flex gap-[10px] items-end mb-3 flex-wrap">

        {/* Nombre del elemento */}
        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Nombre del elemento</label>
          <Input
            name="elementName"
            value={filters.elementName}
            onChange={(e) => setFilters((f) => ({ ...f, elementName: e.target.value }))}
            placeholder="Buscar nombre elemento"
          />
        </div>

        {/* Cuentadante */}
        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Cuentadante</label>
          <Input
            name="accountHolder"
            value={filters.accountHolder}
            onChange={(e) => setFilters((f) => ({ ...f, accountHolder: e.target.value }))}
            placeholder="Ingrese nombre del cuentadante"
          />
        </div>

        {/* Estado */}
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

        {/* Serial */}
        <div className="flex flex-col gap-1 w-full sm:w-[320px]">
          <label className="text-white text-[0.75rem] font-medium">Serial</label>
          <Input
            name="serial"
            value={filters.serial}
            onChange={(e) => setFilters((f) => ({ ...f, serial: e.target.value }))}
            placeholder="Ingrese número de serial"
          />
        </div>

        {/* Limpiar filtros + Reportes */}
        <div className="flex flex-wrap gap-[10px] items-end w-full sm:w-auto">

          <ClearFiltersButton onClick={clearFilters} />

          <div className="flex flex-row gap-[6px] w-full sm:w-auto flex-wrap">
            <ReportDropdown
              label="Generar reporte de todos los materiales devolutivos"
              onPDF={() =>
                generateReturnableMaterialReport({
                  format: "pdf",
                  selectedFields: activeFields,
                  scope: "all",
                  materials: returnableMaterials,
                })
              }
              onExcel={() =>
                generateReturnableMaterialReport({
                  format: "excel",
                  selectedFields: activeFields,
                  scope: "all",
                  materials: returnableMaterials,
                })
              }
            />
            <ReportDropdown
              label="Generar reporte de material devolutivo seleccionado"
              onPDF={() => generateSelectedReport("pdf")}
              onExcel={() => generateSelectedReport("excel")}
            />
          </div>

        </div>

      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-white/70 text-sm px-2 py-4">Cargando materiales...</p>
      ) : (
        <DataTable
          data={filtered}
          columns={getReturnableMaterialColumns(loadMaterials)}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onReportColsChange={setReportCols}
        />
      )}

    </div>
  );
}
