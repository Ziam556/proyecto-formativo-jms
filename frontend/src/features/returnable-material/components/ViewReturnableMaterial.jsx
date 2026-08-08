import { useState, useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { BackButton, Field, Input, Button } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getReturnableMaterials } from "../services/returnableMaterialService";
import { normalizeReturnableMaterial } from "../utils/normalizeReturnableMaterial";

const STATE_CLASS = {
  Disponible:      "bg-green-600",
  "No disponible": "bg-yellow-600",
  "En préstamo":   "bg-blue-600",
  Baja:            "bg-red-600",
  Traslado:        "bg-purple-600",
  Mantenimiento:   "bg-gray-500",
};


export default function ViewReturnableMaterial({ material: initialMaterial, onEdit }) {

  const [searchId, setSearchId]     = useState("");
  const [material, setMaterial]     = useState(initialMaterial ?? null);
  const [notFound, setNotFound]     = useState(false);
  const [allMaterials, setAllMaterials] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Cargar todos los materiales al montar
  useEffect(() => {
    getReturnableMaterials().then(setAllMaterials).catch(() => {});
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
        String(m.returnable_material_id).toLowerCase().includes(searchId.trim().toLowerCase()) ||
        m.material_element_name?.toLowerCase().includes(searchId.trim().toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchId.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (row) => {
    setMaterial(normalizeReturnableMaterial(row));
    setSearchId(String(row.returnable_material_id));
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

  const unitValue = material
    ? Number(material.unitValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";
  const totalValue = material
    ? Number(material.totalValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";

  return (
    <div className="
      w-full max-w-[900px] mx-auto
      rounded-2xl border border-white/10
      bg-white/10 backdrop-blur-md
      shadow-2xl p-6
    ">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/returnable-material/list" />
        <h1 className="text-white text-2xl font-bold">
          Visualizar Material Devolutivo
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
                key={m.returnable_material_id}
                onMouseDown={() => handleSelect(m)}
                className="flex flex-col px-4 py-2 cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-0"
              >
                <span className="text-white text-xs font-semibold">{m.material_element_name}</span>
                <span className="text-white/50 text-[10px]">SN: {m.returnable_material_id} · {m.material_plate}</span>
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
          {/* NOMBRE + IMAGEN + ESTADO */}
          <div className="flex items-center justify-between mb-4 gap-4">
            {/* Imagen */}
            {material.images?.length > 0 ? (
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {material.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:4000/${img}`}
                    alt={`${material.elementName} ${i + 1}`}
                    className="w-[120px] h-[120px] object-cover rounded-xl border border-white/20 bg-white/10"
                  />
                ))}
              </div>
            ) : (
              <div className="w-[120px] h-[120px] rounded-xl border border-white/20 bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-white/30 text-xs text-center px-2">Sin imagen</span>
              </div>
            )}
            {/* Info */}
            <div className="flex flex-col items-end">
              <h2 className="text-white text-xl font-bold">{material.elementName}</h2>
              <p className="text-white/70">{material.brand} {material.model}</p>
              <span className={`mt-1 px-2 py-1 text-xs rounded-full text-white w-fit ${STATE_CLASS[material.state] ?? "bg-gray-500"}`}>
                {material.state}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-white/20 mb-5" />

          {/* IDENTIFICACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">IDENTIFICACIÓN</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="SN"         value={material.id} />
            <Field label="Placa SENA" value={material.plateSena} />
            <Field label="Serial"     value={material.serial} />
            <Field label="Categoría"  value={material.category} />
          </div>

          {/* PRODUCTO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">PRODUCTO</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Nombre"       value={material.elementName} />
            <Field label="Marca"        value={material.brand} />
            <Field label="Modelo"       value={material.model} />
            <Field label="Fecha compra" value={formatDate(material.purchaseDate)} />
          </div>

          {/* VALORACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">VALORACIÓN</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Cantidad"       value={`${material.amount} und`} />
            <Field label="Valor unitario" value={unitValue} />
            <Field label="Valor total"    value={totalValue} />
          </div>

          {/* ASIGNACIÓN Y UBICACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">ASIGNACIÓN Y UBICACIÓN</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Cuentadante" value={material.accountHolder} />
            <Field label="Ubicación"   value={material.location} />
            <Field label="Inventario"  value={material.inventory} />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">DESCRIPCIÓN</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Descripción" value={material.description} />
            {material.dimensions && (
              <Field label="Dimensiones" value={material.dimensions} />
            )}
          </div>

          {/* COTIZACIONES */}
          {material.quotations?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white font-semibold">COTIZACIONES</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {material.quotations.map((url, i) => (
                  <a
                    key={i}
                    href={`http://localhost:4000/${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition"
                  >
                    <FileText size={16} />
                    Cotización {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FICHA TÉCNICA */}
          {material.technicalSheet && (
            <div className="mb-6">
              <a
                href={`http://localhost:4000/${material.technicalSheet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold transition"
              >
                <FileText size={18} />
                Ver ficha técnica
              </a>
            </div>
          )}

          {/* BOTÓN EDITAR */}
          {onEdit && (
            <div className="flex justify-end mt-2">
              <Button variant="primary" size="sm" onClick={() => onEdit(material)}>
                Editar
              </Button>
            </div>
          )}
        </>
      )}

      {/* SIN MATERIAL SELECCIONADO */}
      {!material && !notFound && (
        <p className="text-white/60 text-sm text-center mt-8">
          Busca un material por ID o selecciona uno desde la lista.
        </p>
      )}

    </div>
  );
}
