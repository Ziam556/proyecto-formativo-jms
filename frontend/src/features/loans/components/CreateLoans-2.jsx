import { Input, Button, DatePicker, Textarea, Select, alertWarning } from "@/shared";
import { useState } from "react";
import { CalendarDays, Package } from "lucide-react";

const LOAN_TYPE_OPTIONS = [
  { value: "interno", label: "Interno" },
  { value: "externo", label: "Externo" },
];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function CreateLoans2({ formData, onNext, onBack }) {
  const selectedMaterials = formData?.selectedMaterials ?? [];
  const hasConsumables  = selectedMaterials.some((m) => m.materialtype === "M.C");
  const hasReturnables  = selectedMaterials.some((m) => m.materialtype === "M.D");

  const [fields, setFields] = useState({
    file:                formData?.file                ?? "",
    loanType:            formData?.loanType            ?? "",   // sin valor por defecto
    departureDates:      formData?.departureDates      ?? today(),
    justificationForUse: formData?.justificationForUse ?? "",
  });

  // Detalle por ítem: clave = índice string
  const [itemDetails, setItemDetails] = useState(() => {
    const saved = formData?.itemDetails ?? {};
    const result = {};
    selectedMaterials.forEach((_, i) => {
      const key = String(i);
      result[key] = {
        amount:       saved[key]?.amount       ?? "",
        deliveryDate: saved[key]?.deliveryDate ?? "",
      };
    });
    return result;
  });

  const updateItem = (idx, field, value) =>
    setItemDetails((prev) => ({
      ...prev,
      [String(idx)]: { ...prev[String(idx)], [field]: value },
    }));

  const handleNext = async () => {
    if (!fields.loanType) {
      await alertWarning("Tipo de préstamo", "Debes seleccionar el tipo de préstamo.");
      return;
    }
    if (!fields.justificationForUse.trim()) {
      await alertWarning("Justificación requerida", "Debes ingresar la justificación de uso.");
      return;
    }

    // Validar cantidad por consumible
    for (let i = 0; i < selectedMaterials.length; i++) {
      const m = selectedMaterials[i];
      if (m.materialtype !== "M.C") continue;
      const amt = parseInt(itemDetails[String(i)]?.amount);
      if (!amt || amt <= 0) {
        await alertWarning(
          "Cantidad requerida",
          `Debes ingresar la cantidad a prestar de "${m.material}".`
        );
        return;
      }
      if (amt > m.amount) {
        await alertWarning(
          "Stock insuficiente",
          `Solo hay ${m.amount} unidad(es) disponible(s) de "${m.material}". No puedes prestar ${amt}.`
        );
        return;
      }
    }

    onNext({ ...fields, itemDetails });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Datos del préstamo</h2>
            <p className="text-white/80 text-sm">Completa la información general y el detalle por material</p>
          </div>
        </div>

        {/* DATOS GENERALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 mb-7">
          <Input
            label="Ficha / Grupo aprendices"
            type="text"
            value={fields.file}
            onChange={(e) => setFields((p) => ({ ...p, file: e.target.value }))}
            placeholder="Escribe la ficha o el grupo"
          />

          <Select
            label="Tipo de préstamo *"
            name="loanType"
            value={fields.loanType}
            options={LOAN_TYPE_OPTIONS}
            placeholder="Seleccione el tipo"
            onChange={(e) => setFields((p) => ({ ...p, loanType: e.target.value }))}
            required
          />

          <DatePicker
            label="Fecha de salida (automática)"
            name="departureDates"
            value={fields.departureDates}
            onChange={() => {}}
            disabled
          />
        </div>

        {/* ── CONSUMIBLES: cantidad por ítem ── */}
        {hasConsumables && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Package size={15} className="text-cyan-300 flex-shrink-0" />
              <span className="text-cyan-200 font-semibold text-sm">
                Cantidad a prestar — materiales de consumo
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {selectedMaterials.map((m, i) => {
                if (m.materialtype !== "M.C") return null;
                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-cyan-400/20"
                  >
                    <span
                      className="text-[10px] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap flex-shrink-0"
                      style={{
                        background: "rgba(6,182,212,0.18)",
                        color: "#a5f3fc",
                        border: "1px solid rgba(6,182,212,0.3)",
                      }}
                    >
                      Consumo
                    </span>
                    <span className="text-white text-sm flex-1 min-w-0 truncate">{m.material}</span>
                    <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">
                      Stock: {m.amount}
                    </span>
                    <div className="w-28 flex-shrink-0">
                      <Input
                        type="number"
                        value={itemDetails[String(i)]?.amount ?? ""}
                        onChange={(e) => updateItem(i, "amount", e.target.value)}
                        placeholder="Cant."
                        min={1}
                        max={m.amount}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DEVOLUTIVOS: fecha de entrega por ítem ── */}
        {hasReturnables && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={15} className="text-purple-300 flex-shrink-0" />
              <span className="text-purple-200 font-semibold text-sm">
                Fecha de entrega estimada — materiales devolutivos
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {selectedMaterials.map((m, i) => {
                if (m.materialtype !== "M.D") return null;
                return (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-white/6 border border-purple-400/20"
                  >
                    <span
                      className="text-[10px] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap flex-shrink-0"
                      style={{
                        background: "rgba(139,0,139,0.25)",
                        color: "#e9b8ff",
                        border: "1px solid rgba(200,100,255,0.3)",
                      }}
                    >
                      Devolutivo
                    </span>
                    <span className="text-white text-sm flex-1 min-w-0 truncate">{m.material}</span>
                    <div className="w-44 flex-shrink-0">
                      <DatePicker
                        value={itemDetails[String(i)]?.deliveryDate ?? ""}
                        onChange={(e) => updateItem(i, "deliveryDate", e.target.value)}
                        placeholder="Fecha de entrega"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* JUSTIFICACIÓN */}
        <div className="mb-8">
          <Textarea
            label="Justificación de uso *"
            placeholder="Describe el uso que se dará a los materiales"
            rows={4}
            value={fields.justificationForUse}
            onChange={(e) => setFields((p) => ({ ...p, justificationForUse: e.target.value }))}
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary" size="md" onClick={onBack} className="!min-w-0 px-10">
            Atrás
          </Button>
          <Button variant="primary" size="md" onClick={handleNext} className="!min-w-0 px-10">
            Siguiente
          </Button>
        </div>

      </div>
    </div>
  );
}
