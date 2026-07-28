import { Button, Input, UserSearchField } from "@/shared";
import { alertWarning, alertConfirm, alertSuccess, alertError } from "@/shared";
import { useState } from "react";
import { User, Send, CheckCircle } from "lucide-react";
import { sendVerificationCode, verifyLoanCode } from "../services/loanService";

// Estado del flujo de verificación
const FLOW = {
  IDLE:     "idle",      // usuario seleccionado, aún no se envió código
  SENDING:  "sending",   // enviando correo…
  SENT:     "sent",      // código enviado, esperando que el admin lo ingrese
  VERIFYING:"verifying", // validando código con el backend
  VERIFIED: "verified",  // código correcto ✓
};

export default function CreateLoans3({ onSave, onBack }) {

  const [fields, setFields] = useState({
    userName:         "",
    userDoc:          "",
    userEmail:        "",
    verificationCode: "",
  });

  const [flow,   setFlow]   = useState(FLOW.IDLE);
  const [errors, setErrors] = useState({});

  // ── Enviar código al correo del usuario ────────────────────────────────────
  const handleSendCode = async () => {
    if (!fields.userDoc) {
      setErrors((p) => ({ ...p, userDoc: "Selecciona un usuario primero" }));
      return;
    }
    if (!fields.userEmail) {
      await alertWarning(
        "Sin correo",
        "El usuario seleccionado no tiene correo registrado. No se puede enviar el código."
      );
      return;
    }

    setFlow(FLOW.SENDING);
    try {
      await sendVerificationCode({ userEmail: fields.userEmail, userName: fields.userName });
      setFlow(FLOW.SENT);
      await alertSuccess(
        "Código enviado",
        `Se envió un código de verificación al correo ${fields.userEmail}. Pídele al usuario que te lo diga.`
      );
    } catch (err) {
      setFlow(FLOW.IDLE);
      await alertError("Error al enviar", err.message);
    }
  };

  // ── Validar código ingresado por el admin ──────────────────────────────────
  const handleVerify = async () => {
    if (!fields.verificationCode.trim()) {
      setErrors((p) => ({ ...p, verificationCode: "Ingresa el código antes de verificar" }));
      return;
    }

    setFlow(FLOW.VERIFYING);
    try {
      await verifyLoanCode({ userEmail: fields.userEmail, code: fields.verificationCode });
      setFlow(FLOW.VERIFIED);
      await alertSuccess("¡Verificado!", "El código es correcto. Ya puedes guardar el préstamo.");
    } catch (err) {
      setFlow(FLOW.SENT); // vuelve al estado "enviado" para que pueda reintentar
      setErrors((p) => ({ ...p, verificationCode: err.message }));
    }
  };

  // ── Guardar préstamo ───────────────────────────────────────────────────────
  const handleSave = async () => {
    const newErrors = {};
    if (!fields.userDoc) newErrors.userDoc = "Selecciona un usuario";
    if (flow !== FLOW.VERIFIED) newErrors.verificationCode = "Debes verificar el código antes de guardar";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      await alertWarning("Pendiente", "Selecciona el usuario y verifica el código antes de guardar.");
      return;
    }

    const result = await alertConfirm(
      "¿Guardar préstamo?",
      "¿Confirmas el registro del préstamo con los datos ingresados?"
    );
    if (!result.isConfirmed) return;

    onSave({
      ...fields,
      user:              fields.userName || fields.userDoc,
      notificationEmail: fields.userEmail,
    });
  };

  const codeSent     = flow === FLOW.SENT || flow === FLOW.VERIFYING || flow === FLOW.VERIFIED;
  const codeVerified = flow === FLOW.VERIFIED;
  const sending      = flow === FLOW.SENDING;
  const verifying    = flow === FLOW.VERIFYING;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[420px]">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2 rounded-lg bg-white/20 flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Usuario y confirmación
            </h2>
            <p className="text-white/80 text-sm">
              Seleccione el usuario y confirme con el código
            </p>
          </div>
        </div>

        {/* USUARIO */}
        <div className="mb-5">
          <UserSearchField
            label="Usuario solicitante *"
            value={fields.userDoc}
            onChange={(doc) => {
              setFields((p) => ({ ...p, userDoc: doc, verificationCode: "" }));
              setErrors((p) => ({ ...p, userDoc: "" }));
              setFlow(FLOW.IDLE); // resetear flujo si cambia de usuario
            }}
            onUserSelect={(u) => {
              setFields((p) => ({
                ...p,
                userName:         u.user_name  ?? "",
                userEmail:        u.user_email ?? "",
                verificationCode: "",
              }));
              setFlow(FLOW.IDLE);
            }}
            error={errors.userDoc}
          />
        </div>

        {/* BOTÓN ENVIAR CÓDIGO */}
        {!codeVerified && (
          <Button
            variant="primary"
            size="md"
            className="w-full mb-5"
            onClick={handleSendCode}
            disabled={sending || !fields.userDoc}
          >
            <span className="inline-flex items-center gap-2">
              <Send size={15} />
              {sending ? "Enviando código…" : codeSent ? "Reenviar código" : "Enviar código de verificación"}
            </span>
          </Button>
        )}

        {/* CÓDIGO + VERIFICAR (visible solo después de enviar) */}
        {codeSent && !codeVerified && (
          <div className="mb-4">
            <p className="text-white/70 text-xs mb-3">
              Se envió un código a <span className="text-white font-semibold">{fields.userEmail}</span>. Pídele al usuario que te lo diga e ingrésalo abajo.
            </p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label="Código de verificación *"
                  value={fields.verificationCode}
                  onChange={(e) => {
                    setFields((p) => ({ ...p, verificationCode: e.target.value }));
                    setErrors((p) => ({ ...p, verificationCode: "" }));
                  }}
                  placeholder="Ej: 482931"
                  error={errors.verificationCode}
                  maxLength={6}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                className="!min-w-0 px-6 shrink-0"
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? "Validando…" : "Verificar"}
              </Button>
            </div>
          </div>
        )}

        {/* BADGE VERIFICADO */}
        {codeVerified && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3 mb-5">
            <CheckCircle size={18} className="text-green-400 shrink-0" />
            <div>
              <p className="text-green-300 font-semibold text-sm">Identidad verificada</p>
              <p className="text-green-400/80 text-xs">{fields.userName} · {fields.userEmail}</p>
            </div>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="secondary" size="md" onClick={onBack} className="!min-w-0 px-10">
            Atrás
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            className="!min-w-0 px-10"
            disabled={!codeVerified}
          >
            Guardar
          </Button>
        </div>

      </div>
    </div>
  );
}
