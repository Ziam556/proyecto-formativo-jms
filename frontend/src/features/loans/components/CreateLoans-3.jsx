import { Input, Button } from "@/shared";
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
        <Input
          label="Usuario solicitante"
          type="text"
          value={fields.user}
          onChange={(e) => setFields((p) => ({ ...p, user: e.target.value }))}
          placeholder="Nombre completo"
          error={errors.user}
        />

      </div>

      {/* CÓDIGO DE VERIFICACIÓN */}
      <div className="mb-2">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Código de verificación"
              value={fields.verificationCode}
              onChange={(e) => setFields((p) => ({ ...p, verificationCode: e.target.value }))}
              placeholder="Ingrese código"
              error={errors.verificationCode}
            />
          </div>
          <Button variant="primary" size="md" className="!min-w-0 px-6 shrink-0">
            Verificar
          </Button>
        </div>

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
