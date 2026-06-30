import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BackButton, Field, Input, Button } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getConsumableMaterialById } from "../services/consumableMaterialService";
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
  const [searchId, setSearchId]     = useState("");
  const [material, setMaterial]     = useState(initialMaterial ?? state?.material ?? null);
  const [notFound, setNotFound]     = useState(false);
  const [searching, setSearching]   = useState(false);

  const handleSearch = async () => {
    const id = searchId.trim();
    if (!id) return;

    setSearching(true);
    try {
      const row = await getConsumableMaterialById(id);
      const normalized = normalizeConsumableMaterial(row);
      // El estado viene como código (ej. "N.D", "T"); lo traducimos
      // a la etiqueta legible (ej. "No disponible", "Traslado") para
      // mostrarlo y para que coincida con las claves de STATE_CLASS.
      const stateLabel = await translateStateCode(normalized.state);
      setMaterial({ ...normalized, state: stateLabel });
      setNotFound(false);
    } catch (err) {
      setMaterial(null);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const unitValue  = material
    ? Number(material.unitValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";
  const totalValue = material
    ? Number(material.totalValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    : "";

  return (
    <div className="min-h-full px-6 py-5">
    <div className="
      w-full max-w-[900px] mx-auto
      rounded-2xl border border-white/10
      bg-white/10 backdrop-blur-md
      shadow-2xl p-6
    ">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/consumable-material/list" />
        <h1 className="text-white text-2xl font-bold">
          Visualizar Material de consumo
        </h1>
      </div>

      {/* BUSCADOR POR ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="w-full sm:w-[220px]">
          <Input
            label="ID Material Consumo"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ingresa el ID"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleSearch} disabled={searching}>
          {searching ? "Buscando..." : "Buscar"}
        </Button>
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

          {/* IDENTIFICACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">IDENTIFICACIÓN</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="ID"         value={material.id} />
            <Field label="Placa Sena" value={material.plateSena} />
          </div>

          {/* PRODUCTO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">Producto</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Marca"        value={material.brand} />
            <Field label="Cantidad"     value={`${material.amount} und`} />
            <Field label="Fecha compra" value={formatDate(material.purchaseDate)} />
          </div>

          {/* VALORACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">Valoración</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="Valor unitario" value={unitValue} />
            <Field label="Valor total"    value={totalValue} />
          </div>

          {/* ASIGNACIÓN Y UBICACIÓN */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">Asignación y Ubicación</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            <Field label="Estado"      value={material.state} />
            <Field label="Cuentadante" value={material.accountHolder} />
            <Field label="Ubicación"   value={material.location} />
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