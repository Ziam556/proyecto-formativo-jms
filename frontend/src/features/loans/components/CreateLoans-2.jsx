import { Input, Button, DatePicker } from "@/shared";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

const inputClass = `
  w-full h-[56px]
  rounded-md border border-black/20
  px-4 text-sm
  bg-[rgba(217,217,217,0.54)]
  outline-none backdrop-blur-sm
`;

export default function CreateLoans2({ onNext, onBack }) {

  const [fields, setFields] = useState({
    file: "",
    amount: "",
    departureDates: "",
    deliveryDates: "",
    justificationForUse: "",
  });

  const handleNext = () => onNext(fields);

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
          <CalendarDays size={20} className="text-black" />
        </div>
        <div>
          <h2 className="text-black font-bold text-lg leading-tight">
            Datos del préstamo
          </h2>
          <p className="text-black/70 text-sm">
            Completa la información del préstamo
          </p>
        </div>
      </div>

      {/* INPUTS 2 COLUMNAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">

        {/* FICHA */}
        <Input
          label="Ficha/Grupo aprendices"
          type="text"
          value={fields.file}
          onChange={(e) => setFields((p) => ({ ...p, file: e.target.value }))}
          placeholder="Escribe la ficha o el grupo de aprendices"
        />

        {/* CANTIDAD */}
        <Input
          label="Cantidad (Consumo)"
          type="number"
          value={fields.amount}
          onChange={(e) => setFields((p) => ({ ...p, amount: e.target.value }))}
          placeholder="Escribe la cantidad"
        />

        {/* FECHA SALIDA */}
        <DatePicker
          label="Fecha de salida"
          name="departureDates"
          value={fields.departureDates}
          onChange={(e) => setFields((p) => ({ ...p, departureDates: e.target.value }))}
          placeholder="Seleccione la fecha de salida"
        />

        {/* FECHA ENTREGA */}
        <DatePicker
          label="Fecha de entrega (Devolutivo)"
          name="deliveryDates"
          value={fields.deliveryDates}
          onChange={(e) => setFields((p) => ({ ...p, deliveryDates: e.target.value }))}
          placeholder="Seleccione la fecha de entrega"
        />

      </div>

      {/* JUSTIFICACIÓN — label como placeholder dentro del textarea */}
      <div className="mt-5">
        <textarea
          value={fields.justificationForUse}
          onChange={(e) => setFields((p) => ({ ...p, justificationForUse: e.target.value }))}
          placeholder="Justificación de uso"
          className="
            w-full h-[120px]
            rounded-md border border-black/20
            px-4 py-3 text-sm
            resize-none outline-none
            bg-[rgba(217,217,217,0.54)]
            backdrop-blur-sm
          "
        />
      </div>

      {/* BOTONES */}
      <div className="flex gap-4 mt-8">
        <Button
          variant="secondary"
          size="md"
          onClick={onBack}
          className="!min-w-0 flex-1"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleNext}
          className="!min-w-0 flex-1"
        >
          Siguiente
        </Button>
      </div>

    </div>
  );
}
