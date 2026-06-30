import { useState } from "react";
import { FileText } from "lucide-react";
import { BackButton, Field, Input, Button } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getReturnableMaterialById } from "../services/returnableMaterialService";
import { normalizeReturnableMaterial } from "../utils/normalizeReturnableMaterial";

const STATE_CLASS = {
  Disponible:      "bg-green-600",
  "No Disponible": "bg-yellow-600",
  Prestamo:        "bg-blue-600",
  Baja:            "bg-red-600",
  Traslado:        "bg-purple-600",
  Mantenimiento:   "bg-gray-500",
};


export default function ViewReturnableMaterial({ material: initialMaterial, onEdit }) {

  const [searchId, setSearchId]   = useState("");
  const [material, setMaterial]   = useState(initialMaterial ?? null);
  const [notFound, setNotFound]   = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    const id = searchId.trim();
    if (!id) return;
    setSearching(true);
    setNotFound(false);
    setMaterial(null);
    try {
      const raw = await getReturnableMaterialById(id);
      setMaterial(normalizeReturnableMaterial(raw));
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
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

      {/* BUSCADOR POR ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="w-full sm:w-[220px]">
          <Input
            label="ID Material Devolutivo"
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
            <Field label="ID"         value={material.id} />
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
