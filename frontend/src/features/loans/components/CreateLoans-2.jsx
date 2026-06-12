import { InputForList, Button } from "@/shared";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    departureDates: null,
    deliveryDates: null,
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
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">

        {/* FICHA */}
        <InputForList
          label="Ficha/Grupo aprendices"
          labelClassName="text-black font-semibold text-sm"
          type="text"
          value={fields.file}
          onChange={(e) => setFields((p) => ({ ...p, file: e.target.value }))}
          placeholder="Escribe la ficha o el grupo de aprendices"
        />

        {/* CANTIDAD */}
        <InputForList
          label="Cantidad (Consumo)"
          labelClassName="text-black font-semibold text-sm"
          type="number"
          value={fields.amount}
          onChange={(e) => setFields((p) => ({ ...p, amount: e.target.value }))}
          placeholder="Escribe la cantidad"
        />

        {/* FECHA SALIDA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Fecha de salida
          </label>
          <DatePicker
            selected={fields.departureDates}
            onChange={(date) => setFields((p) => ({ ...p, departureDates: date }))}
            placeholderText="Seleccione la fecha de salida"
            dateFormat="dd/MM/yyyy"
            wrapperClassName="w-full"
            className={inputClass}
          />
        </div>

        {/* FECHA ENTREGA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Fecha de entrega (Devolutivo)
          </label>
          <DatePicker
            selected={fields.deliveryDates}
            onChange={(date) => setFields((p) => ({ ...p, deliveryDates: date }))}
            placeholderText="Seleccione la fecha de entrega"
            dateFormat="dd/MM/yyyy"
            wrapperClassName="w-full"
            className={inputClass}
          />
        </div>

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
