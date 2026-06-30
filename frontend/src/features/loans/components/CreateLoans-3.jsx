import { Button, Input, UserSearchField } from "@/shared";
import { alertWarning, alertConfirm } from "@/shared";
import { useState } from "react";
import { User } from "lucide-react";

export default function CreateLoans3({ onSave, onBack }) {

  const [fields, setFields] = useState({
    user:             "",   // nombre completo (para mostrar)
    userDoc:          "",   // documento del usuario seleccionado
    verificationCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const newErrors = {};
    if (!fields.userDoc)                 newErrors.userDoc          = "Selecciona un usuario";
    if (!fields.verificationCode.trim()) newErrors.verificationCode = "El código es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      await alertWarning("Campos requeridos", "Selecciona el usuario y escribe el código de verificación.");
      return;
    }

    const result = await alertConfirm(
      "¿Guardar préstamo?",
      "¿Confirmas el registro del préstamo con los datos ingresados?"
    );
    if (!result.isConfirmed) return;

    // Pasar el doc como "user" al padre (compatible con el body de createLoan)
    onSave({ ...fields, user: fields.userDoc });
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Contenedor centrado */}
      <div className="w-full max-w-[420px]">

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

        {/* USUARIO — buscador */}
        <div className="mb-5">
          <UserSearchField
            label="Usuario solicitante *"
            value={fields.userDoc}
            onChange={(doc) => {
              setFields((p) => ({ ...p, userDoc: doc }));
              setErrors((p) => ({ ...p, userDoc: "" }));
            }}
            error={errors.userDoc}
          />
        </div>

        {/* CÓDIGO DE VERIFICACIÓN */}
        <div className="mb-2">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Código de verificación *"
                value={fields.verificationCode}
                onChange={(e) => {
                  setFields((p) => ({ ...p, verificationCode: e.target.value }));
                  setErrors((p) => ({ ...p, verificationCode: "" }));
                }}
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
        <div className="flex justify-end gap-4 mt-10">
          <Button variant="secondary" size="md" onClick={onBack} className="!min-w-0 px-10">
            Atrás
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} className="!min-w-0 px-10">
            Guardar
          </Button>
        </div>

      </div>
    </div>
  );
}
