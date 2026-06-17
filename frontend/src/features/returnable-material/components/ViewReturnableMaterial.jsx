import { useState } from "react";
import { BackButton } from "@/shared";
import { returnableMaterials } from "../data/returnableMaterials";

const STATE_CLASS = {
  Disponible:      "bg-green-600",
  "No Disponible": "bg-yellow-600",
  Prestamo:        "bg-blue-600",
  Baja:            "bg-red-600",
  Traslado:        "bg-purple-600",
  Mantenimiento:   "bg-gray-500",
};

function Field({ label, value }) {
  return (
    <div className="bg-white/80 rounded-[8px] p-3 flex-1 min-w-[140px]">
      <span className="text-black/50 text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
      <p className="text-black font-medium mt-[2px]">{value ?? "—"}</p>
    </div>
  );
}

export default function ViewReturnableMaterial({ material: initialMaterial, onEdit }) {

  const [searchId, setSearchId] = useState("");
  const [material, setMaterial] = useState(initialMaterial ?? null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = returnableMaterials.find(
      (m) => String(m.id) === searchId.trim()
    );
    if (found) {
      setMaterial(found);
      setNotFound(false);
    } else {
      setMaterial(null);
      setNotFound(true);
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
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm font-medium">
            ID Material Devolutivo
          </label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ingresa el ID"
            className="
              h-[44px] w-full sm:w-[220px] rounded-md px-4
              bg-white/70 text-black outline-none
              border border-white/30
            "
          />
        </div>
        <button
          onClick={handleSearch}
          className="
            h-[44px] px-5 rounded-md
            bg-cyan-700 hover:bg-cyan-800
            text-white font-semibold transition
          "
        >
          Buscar
        </button>
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
          {/* NOMBRE + ESTADO */}
          <div className="flex justify-end mb-4">
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
            <Field label="Fecha compra" value={material.purchaseDate} />
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
            <Field label="Dimensiones" value={material.dimensions} />
          </div>

          {/* BOTÓN EDITAR */}
          <div className="flex justify-end">
            <button
              onClick={onEdit}
              className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
            >
              Editar
            </button>
          </div>
        </>
      )}

      {/* ESTADO INICIAL */}
      {!material && !notFound && (
        <p className="text-white/50 text-sm mt-2">
          Ingresa un ID y presiona Buscar para ver los datos del material.
        </p>
      )}

    </div>
  );
}
