import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BackButton, Field, Input, Button } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getConsumableMaterials } from "../services/consumableMaterialService";
import { normalizeConsumableMaterial } from "../utils/normalizeConsumableMaterial";
import { translateStateCode } from "../utils/stateLabels";

const API_BASE = "http://localhost:4000";

const STATE_CLASS = {
  Disponible:      "bg-green-600",
  "No disponible": "bg-yellow-600",
  Prestamo:        "bg-blue-600",
  Baja:            "bg-red-600",
  Traslado:        "bg-purple-600",
  Mantenimiento:   "bg-gray-500",
};


export default function ViewConsumableMaterial({ material: initialMaterial, onCancel }) {

  const { state } = useLocation();
  const [searchId, setSearchId]         = useState("");
  const [material, setMaterial]         = useState(initialMaterial ?? state?.material ?? null);
  const [notFound, setNotFound]         = useState(false);
  const [allMaterials, setAllMaterials] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Cargar todos los materiales al montar
  useEffect(() => {
    getConsumableMaterials().then(setAllMaterials).catch(() => {});
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filtrar mientras escribe
  const suggestions = searchId.trim()
    ? allMaterials.filter((m) =>
        String(m.consumable_material_id).toLowerCase().includes(searchId.trim().toLowerCase()) ||
        m.material_element_name?.toLowerCase().includes(searchId.trim().toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchId.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = async (row) => {
    const normalized = normalizeConsumableMaterial(row);
    const stateLabel = await translateStateCode(normalized.state);
    setMaterial({ ...normalized, state: stateLabel });
    setSearchId(String(row.consumable_material_id));
    setNotFound(false);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    setSearchId(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value.trim()) {
      setMaterial(null);
      setNotFound(false);
    }
  };

  const unitValue  = material
    ? Number(material.unitValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";
  const totalValue = material
    ? Number(material.totalValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";

  return (
    <div className="min-h-full px-6 py-3">
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/consumable-material/list" />
        <h1 className="text-white text-2xl font-bold">
          Visualizar Material de consumo
        </h1>
      </div>

      {/* BUSCADOR EN VIVO */}
      <div ref={wrapperRef} className="relative w-full sm:w-[320px] mb-6">
        <Input
          label="Buscar por ID, nombre o placa"
          type="text"
          value={searchId}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Escribe para buscar..."
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1e1230] border border-white/20 rounded-xl overflow-hidden shadow-xl max-h-56 overflow-y-auto">
            {suggestions.map((m) => (
              <li
                key={m.consumable_material_id}
                onMouseDown={() => handleSelect(m)}
                className="flex flex-col px-4 py-2 cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-0"
              >
                <span className="text-white text-xs font-semibold">{m.material_element_name}</span>
                <span className="text-white/50 text-[10px]">ID: {m.consumable_material_id} · {m.material_plate}</span>
              </li>
            ))}
          </ul>
        )}
        {showSuggestions && searchId.trim() && suggestions.length === 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1e1230] border border-white/20 rounded-xl px-4 py-3 text-white/50 text-xs shadow-xl">
            Sin resultados
          </div>
        )}
      </div>

      {/* NO ENCONTRADO */}
      {notFound && (
        <p className="text-red-400 font-medium mb-4">
          No se encontró ningún material con ese ID.
        </p>
      )}

      {/* DATOS DEL MATERIAL */}
      {material && (
        <>
          {/* IMÁGENES + INFO PRINCIPAL */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {material.images?.length > 0 ? (
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {material.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_BASE}/${img}`}
                    alt={`${material.elementName} ${i + 1}`}
                    className="w-[120px] h-[120px] object-cover rounded-xl border border-white/20 bg-white/10"
                  />
                ))}
              </div>
            ) : (
              <div className="flex-shrink-0 w-[120px] h-[120px] rounded-xl border border-white/20 bg-white/10 flex items-center justify-center">
                <span className="text-white/30 text-xs text-center px-2">Sin imagen</span>
              </div>
            )}
            <div className="flex flex-col justify-center gap-2">
              <h2 className="text-white text-xl font-bold">{material.elementName}</h2>
              <p className="text-white/70">{material.brand}</p>
              <span className={`px-2 py-1 text-xs rounded-full text-white w-fit ${STATE_CLASS[material.state] ?? "bg-gray-500"}`}>
                {material.state}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-white/20 mb-5" />

          {/* SECCIONES EN 2 COLUMNAS EN DESKTOP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">

            {/* COLUMNA IZQUIERDA */}
            <div>
              {/* IDENTIFICACIÓN */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white font-semibold">IDENTIFICACIÓN</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <Field label="SN"         value={material.id} />
                <Field label="Placa SENA" value={material.plateSena} />
              </div>

              {/* PRODUCTO */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white font-semibold">PRODUCTO</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <Field label="Marca"        value={material.brand} />
                <Field label="Cantidad"     value={`${material.amount} und`} />
                <Field label="Fecha compra" value={formatDate(material.purchaseDate)} />
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div>
              {/* VALORACIÓN */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white font-semibold">VALORACIÓN</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <Field label="Valor unitario" value={unitValue} />
                <Field label="Valor total"    value={totalValue} />
              </div>

              {/* ASIGNACIÓN Y UBICACIÓN */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white font-semibold">ASIGNACIÓN Y UBICACIÓN</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-3 mb-5">
                <Field label="Estado"      value={material.state} />
                <Field label="Cuentadante" value={material.accountHolder} />
                <Field label="Ubicación"   value={material.location} />
              </div>
            </div>

          </div>

          {/* BOTÓN EDITAR */}
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Editar
            </Button>
          </div>
        </>
      )}

      {/* ESTADO INICIAL — sin material seleccionado */}
      {!material && !notFound && (
        <p className="text-white/50 text-sm mt-2">
          Ingresa un ID y presiona Buscar para ver los datos del material.
        </p>
      )}

    </div>
    </div>
  );
}