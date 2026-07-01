import { Input, Button, DatePicker, Textarea } from "@/shared";
import { alertWarning } from "@/shared";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

export default function CreateLoans2({ formData, onNext, onBack }) {

  const [fields, setFields] = useState({
    file:               formData?.file               ?? "",
    amount:             formData?.amount             ?? "",
    departureDates:     formData?.departureDates     ?? "",
    deliveryDates:      formData?.deliveryDates      ?? "",
    justificationForUse: formData?.justificationForUse ?? "",
  });

  const handleNext = async () => {
    const missing = [];
    if (!fields.file.trim())         missing.push("Ficha / Grupo aprendices");
    if (!fields.departureDates)      missing.push("Fecha de salida");

    if (missing.length > 0) {
      await alertWarning(
        "Campos requeridos",
        `Completa los siguientes campos antes de continuar:\n• ${missing.join("\n• ")}`
      );
      return;
    }

    onNext(fields);
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Contenedor centrado */}
      <div className="w-full max-w-[560px]">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Datos del préstamo
            </h2>
            <p className="text-white/80 text-sm">
              Completa la información del préstamo
            </p>
          </div>
        </div>

        {/* INPUTS 2 COLUMNAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">

          <Input
            label="Ficha/Grupo aprendices *"
            type="text"
            value={fields.file}
            onChange={(e) => setFields((p) => ({ ...p, file: e.target.value }))}
            placeholder="Escribe la ficha o el grupo"
          />

          <Input
            label="Cantidad (Consumo)"
            type="number"
            value={fields.amount}
            onChange={(e) => setFields((p) => ({ ...p, amount: e.target.value }))}
            placeholder="Escribe la cantidad"
          />

          <DatePicker
            label="Fecha de salida *"
            name="departureDates"
            value={fields.departureDates}
            onChange={(e) =>
              setFields((p) => ({ ...p, departureDates: e.target.value }))
            }
            placeholder="Seleccione la fecha de salida"
          />

          <DatePicker
            label="Fecha de entrega (Devolutivo)"
            name="deliveryDates"
            value={fields.deliveryDates}
            onChange={(e) =>
              setFields((p) => ({ ...p, deliveryDates: e.target.value }))
            }
            placeholder="Seleccione la fecha de entrega"
          />

        </div>

        {/* JUSTIFICACIÓN */}
        <div className="mt-5">
          <Textarea
            label="Justificación de uso"
            placeholder="Describe el uso que se dará a los materiales"
            rows={4}
            value={fields.justificationForUse}
            onChange={(e) =>
              setFields((p) => ({ ...p, justificationForUse: e.target.value }))
            }
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-8">
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
