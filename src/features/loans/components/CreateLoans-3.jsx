import { InputForList, Button } from "@/shared";
import { useState } from "react";
import { User } from "lucide-react";

export default function CreateLoans3({ onSave, onBack }) {

  const [fields, setFields] = useState({
    user: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const newErrors = {};
    if (!fields.user)             newErrors.user = "El nombre es requerido";
    if (!fields.verificationCode) newErrors.verificationCode = "El código es requerido";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(fields);
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
          <User size={20} className="text-black" />
        </div>
        <div>
          <h2 className="text-black font-bold text-lg leading-tight">
            Usuario y confirmación
          </h2>
          <p className="text-black/70 text-sm">
            Seleccione el usuario y confirme la operación
          </p>
        </div>
      </div>

      {/* USUARIO */}
      <div className="mb-5">
        <InputForList
          label="Usuario solicitante"
          labelClassName="text-black font-semibold text-sm"
          type="text"
          value={fields.user}
          onChange={(e) => setFields((p) => ({ ...p, user: e.target.value }))}
          placeholder="Nombre completo"
        />
        {errors.user && (
          <p className="text-red-500 text-xs mt-1">{errors.user}</p>
        )}
      </div>

      {/* CÓDIGO DE VERIFICACIÓN */}
      <div className="mb-2">
        <label className="text-sm font-semibold text-black block mb-1">
          Código de verificación
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={fields.verificationCode}
              onChange={(e) => setFields((p) => ({ ...p, verificationCode: e.target.value }))}
              placeholder="Ingrese código"
              className="
                w-full h-[56px]
                rounded-md border border-black/20
                px-4 text-sm
                bg-[rgba(217,217,217,0.54)]
                outline-none backdrop-blur-sm
              "
            />
          </div>
          <button
            type="button"
            className="
              h-[56px] px-6
              rounded-md
              bg-green-600 hover:bg-green-700
              text-white text-sm font-semibold
              transition flex-shrink-0
            "
          >
            Verificar
          </button>
        </div>
        {errors.verificationCode && (
          <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>
        )}
      </div>

      {/* BOTONES */}
      <div className="flex gap-4 mt-10">
        <Button
          variant="secondary"
          size="md"
          onClick={onBack}
          className="!min-w-0 flex-1"
        >
          Atrás
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          className="!min-w-0 flex-1"
        >
          Guardar
        </Button>
      </div>

    </div>
  );
}
