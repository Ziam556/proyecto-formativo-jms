import { BackButton, Button, Field } from "@/shared";
import { FileText } from "lucide-react";

const API_BASE = "http://localhost:4000";

const STATE_CLASS = {
  Disponible:      "bg-green-600",
  "No disponible": "bg-yellow-600",
  "En préstamo":   "bg-blue-600",
  Baja:            "bg-red-600",
  Traslado:        "bg-purple-600",
  Mantenimiento:   "bg-gray-500",
};

export default function ViewConsumableMaterial({ material, onCancel }) {
  if (!material) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-white text-lg">Material no encontrado.</p>
      </div>
    );
  }

  const unitValue  = Number(material.unitValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  const totalValue = Number(material.totalValue).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  const imageUrl = material.image ? `${API_BASE}/${material.image}` : null;

  return (
    <div className="w-full max-w-[900px] mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/consumable-material/list" />
        <h1 className="text-white text-2xl font-bold">Visualizar Material de Consumo</h1>
      </div>

      {/* IMAGEN + INFO PRINCIPAL */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">

        {/* Imagen */}
        {imageUrl ? (
          <div className="shrink-0 w-full sm:w-[200px] h-[180px] rounded-xl overflow-hidden border border-white/20 bg-white/5">
            <img
              src={imageUrl}
              alt={material.elementName}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="shrink-0 w-full sm:w-[200px] h-[180px] rounded-xl border border-white/20 bg-white/5 flex items-center justify-center">
            <span className="text-white/30 text-sm">Sin imagen</span>
          </div>
        )}

        {/* Info principal */}
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
        <Field label="SN"         value={material.id} />
        <Field label="Placa SENA" value={material.plateSena} />
      </div>

      {/* PRODUCTO */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white font-semibold">PRODUCTO</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <Field label="Marca"        value={material.brand} />
        <Field label="Cantidad"     value={`${material.amount} und`} />
        <Field label="Fecha compra" value={material.purchaseDate} />
      </div>

      {/* VALORACIÓN */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white font-semibold">VALORACIÓN</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <Field label="Valor unitario" value={unitValue} />
        <Field label="Valor total"    value={totalValue} />
      </div>

      {/* ASIGNACIÓN Y UBICACIÓN */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-white font-semibold">ASIGNACIÓN Y UBICACIÓN</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <Field label="Estado"      value={material.state} />
        <Field label="Cuentadante" value={material.accountHolder} />
        <Field label="Ubicación"   value={material.location} />
        <Field label="Inventario"  value={material.inventory} />
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
                href={`${API_BASE}/${url}`}
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

      {/* BOTÓN EDITAR */}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Editar
        </Button>
      </div>

    </div>
  );
}
