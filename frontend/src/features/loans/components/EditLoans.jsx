import { useState, useEffect } from "react";
import { Input, Button, BackButton, DatePicker, Textarea, Select, UserSearchField, alertWarning, alertConfirm, alertSuccess, alertError } from "@/shared";
import { UserCheck, UserX, Send, CheckCircle } from "lucide-react";
import { sendVerificationCode, verifyLoanCode } from "../services/loanService";

const FLOW = { IDLE: "idle", SENDING: "sending", SENT: "sent", VERIFYING: "verifying", VERIFIED: "verified" };

const LOAN_TYPE_OPTIONS = [
  { value: "interno", label: "Interno" },
  { value: "externo", label: "Externo" },
];

const TYPE_COLOR = {
  Devolutivo: { bg: "rgba(139,0,139,0.25)", color: "#e9b8ff", border: "rgba(200,100,255,0.3)" },
  Consumo:    { bg: "rgba(6,182,212,0.18)", color: "#a5f3fc", border: "rgba(6,182,212,0.3)"  },
};

export default function EditLoans({ formData = {}, loading = false, onSave, onCancel }) {

  const loanMaterials = formData?.materiales || [];

  const [fields, setFields] = useState({
    loansId:          formData?.loansId         || "",
    fichaGrupo:       formData?.fichaGrupo      || "",
    loanType:         formData?.loanType        || "interno",
    fechaSalida:      formData?.fechaSalida     || "",
    justificacion:    formData?.justificacion   || "",
    // usuario
    usuarioSolicita:  formData?.usuarioSolicita || "",
    userDoc:          "",
    userName:         formData?.usuarioSolicita || "",
    userEmail:        "",
    verificationCode: "",
  });

  const [isRegistered, setIsRegistered] = useState(true);
  const [flow, setFlow]                 = useState(
    formData?.usuarioSolicita ? FLOW.VERIFIED : FLOW.IDLE
  );
  const [errors, setErrors]             = useState({});

  // Sync fields when formData prop updates (after async fetch in parent)
  useEffect(() => {
    const hasUser = !!formData?.usuarioSolicita;
    setFields({
      loansId:          formData?.loansId         || "",
      fichaGrupo:       formData?.fichaGrupo      || "",
      loanType:         formData?.loanType        || "interno",
      fechaSalida:      formData?.fechaSalida     || "",
      justificacion:    formData?.justificacion   || "",
      usuarioSolicita:  formData?.usuarioSolicita || "",
      userDoc:          "",
      userName:         formData?.usuarioSolicita || "",
      userEmail:        "",
      verificationCode: "",
    });
    setFlow(hasUser ? FLOW.VERIFIED : FLOW.IDLE);
  }, [formData]);

  const handleToggleRegistered = (value) => {
    setIsRegistered(value);
    setFields((p) => ({ ...p, userDoc: "", userEmail: "", verificationCode: "" }));
    setFlow(FLOW.IDLE);
    setErrors((p) => ({ ...p, userDoc: "", userEmail: "", verificationCode: "" }));
  };

  const handleSendCode = async () => {
    if (isRegistered && !fields.userDoc) {
      setErrors((p) => ({ ...p, userDoc: "Selecciona un usuario primero" })); return;
    }
    if (!isRegistered && !fields.userEmail) {
      setErrors((p) => ({ ...p, userEmail: "Ingresa el correo del receptor" })); return;
    }
    if (!fields.userEmail) {
      await alertWarning("Sin correo", "El usuario seleccionado no tiene correo registrado."); return;
    }
    setFlow(FLOW.SENDING);
    try {
      await sendVerificationCode({ userEmail: fields.userEmail, userName: fields.userName });
      setFlow(FLOW.SENT);
      await alertSuccess("Código enviado", `Se envió un código al correo ${fields.userEmail}.`, 7000);
    } catch (err) {
      setFlow(FLOW.IDLE);
      await alertError("Error al enviar", err.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!fields.verificationCode.trim()) {
      setErrors((p) => ({ ...p, verificationCode: "Ingresa el código" })); return;
    }
    setFlow(FLOW.VERIFYING);
    try {
      await verifyLoanCode({ userEmail: fields.userEmail, code: fields.verificationCode });
      setFlow(FLOW.VERIFIED);
      setFields((p) => ({ ...p, usuarioSolicita: p.userName || p.userDoc }));
      await alertSuccess("¡Verificado!", "Código correcto. Ya puedes guardar los cambios.");
    } catch (err) {
      setFlow(FLOW.SENT);
      setErrors((p) => ({ ...p, verificationCode: err.message }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!fields.fechaSalida)     newErrors.fechaSalida   = "La fecha de salida es requerida";
    if (!fields.justificacion)   newErrors.justificacion = "La justificación es requerida";
    if (!fields.usuarioSolicita) newErrors.userDoc       = "Selecciona un usuario";
    if (flow !== FLOW.VERIFIED)  newErrors.verificationCode = "Verifica el código antes de guardar";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      await alertWarning("Campos requeridos", "Completa todos los campos y verifica el código antes de guardar.");
      return;
    }

    const result = await alertConfirm("¿Guardar cambios?", "¿Confirmas los cambios en este préstamo?");
    if (!result.isConfirmed) return;

    onSave(fields);
  };

  const codeSent     = flow === FLOW.SENT || flow === FLOW.VERIFYING || flow === FLOW.VERIFIED;
  const codeVerified = flow === FLOW.VERIFIED;
  const sending      = flow === FLOW.SENDING;
  const verifying    = flow === FLOW.VERIFYING;

  return (
    <div className="w-full max-w-[1100px] mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4">
      <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl px-4 py-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton to="/dashboard/loans" />
          <h1 className="text-white text-2xl font-bold">Editar préstamo</h1>
          {loading && (
            <span className="text-white/40 text-xs animate-pulse">actualizando…</span>
          )}
        </div>

        {/* ID */}
        <div className="w-full sm:w-[320px] mb-6">
          <Input
            label="ID Préstamo"
            name="loansId"
            value={fields.loansId}
            onChange={() => {}}
            readOnly
            className="opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="mt-4 w-full h-px bg-white/20" />

        {/* MATERIALES DEL PRÉSTAMO */}
        <div className="flex items-center gap-3 mt-5">
          <span className="text-white font-semibold">MATERIALES DEL PRÉSTAMO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {loanMaterials.length === 0 ? (
            <p className="text-white/50 text-sm py-3">Sin materiales registrados.</p>
          ) : (
            loanMaterials.map((m, i) => {
              const s = TYPE_COLOR[m.type] || TYPE_COLOR.Devolutivo;
              return (
                <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-black/25 border border-white/20">
                  <span
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                    className="text-[10px] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
                  >
                    {m.type}
                  </span>
                  <span className="text-white text-sm flex-1">{m.name}</span>
                  {m.type === "Consumo" && m.amount != null && (
                    <span className="text-white/50 text-xs">Cant: {m.amount}</span>
                  )}
                  {m.type === "Devolutivo" && m.deliveryDateFmt && m.deliveryDateFmt !== "—" && (
                    <span className="text-white/50 text-xs">Entrega: {m.deliveryDateFmt}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* DATOS DEL PRÉSTAMO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">DATOS DEL PRÉSTAMO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input
              label="Ficha / Grupo aprendices"
              name="fichaGrupo"
              value={fields.fichaGrupo}
              onChange={handleChange}
            />

            <Select
              label="Tipo de préstamo"
              name="loanType"
              value={fields.loanType}
              options={LOAN_TYPE_OPTIONS}
              onChange={handleChange}
              required
            />

            <DatePicker
              label="Fecha de salida *"
              name="fechaSalida"
              value={fields.fechaSalida}
              onChange={handleChange}
              error={errors.fechaSalida}
            />

          </div>

          <div className="mt-4">
            <Textarea
              label="Justificación de uso *"
              name="justificacion"
              value={fields.justificacion}
              onChange={handleChange}
              rows={3}
              error={errors.justificacion}
            />
          </div>
        </div>

        {/* USUARIO */}
        <div className="flex items-center gap-3 mt-7">
          <span className="text-white font-semibold">USUARIO</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="mt-5 max-w-2xl mx-auto flex flex-col gap-4">

          {/* Badge usuario actual */}
          {formData?.usuarioSolicita && (
            <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-sm">
              <span className="text-white/50">Usuario actual:</span>
              <span className="text-white font-semibold">{formData.usuarioSolicita}</span>
            </div>
          )}

          {/* Toggle registrado / no registrado */}
          <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3">
            <span className="text-white text-sm flex-1">¿El usuario está registrado en el sistema?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleRegistered(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  isRegistered ? "bg-purple-600 border-purple-500 text-white" : "bg-transparent border-white/30 text-white/50"
                }`}
              >
                <UserCheck size={13} /> Sí
              </button>
              <button
                type="button"
                onClick={() => handleToggleRegistered(false)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  !isRegistered ? "bg-orange-600 border-orange-500 text-white" : "bg-transparent border-white/30 text-white/50"
                }`}
              >
                <UserX size={13} /> No
              </button>
            </div>
          </div>

          {/* Buscador (registrado) */}
          {isRegistered && (
            <UserSearchField
              label="Usuario solicitante *"
              value={fields.userDoc}
              onChange={(doc) => {
                setFields((p) => ({ ...p, userDoc: doc, verificationCode: "" }));
                setErrors((p) => ({ ...p, userDoc: "" }));
                setFlow(FLOW.IDLE);
              }}
              onUserSelect={(u) => {
                setFields((p) => ({
                  ...p,
                  userName:  u.user_name  ?? "",
                  userEmail: u.user_email ?? "",
                  verificationCode: "",
                }));
                setFlow(FLOW.IDLE);
              }}
              error={errors.userDoc}
            />
          )}

          {/* Campos (no registrado) */}
          {!isRegistered && (
            <>
              <Input
                label="Correo electrónico del receptor *"
                type="email"
                placeholder="correo@ejemplo.com"
                value={fields.userEmail}
                onChange={(e) => {
                  setFields((p) => ({ ...p, userEmail: e.target.value, verificationCode: "" }));
                  setErrors((p) => ({ ...p, userEmail: "" }));
                  setFlow(FLOW.IDLE);
                }}
                error={errors.userEmail}
                labelVariant="light"
              />
              <Input
                label="Nombre del receptor (opcional)"
                placeholder="Nombre completo"
                value={fields.userName}
                onChange={(e) => setFields((p) => ({ ...p, userName: e.target.value }))}
                labelVariant="light"
              />
            </>
          )}

          {/* Botón enviar código */}
          {!codeVerified && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSendCode}
              disabled={sending || (isRegistered ? !fields.userDoc : !fields.userEmail)}
            >
              <span className="inline-flex items-center gap-2">
                <Send size={15} />
                {sending ? "Enviando código…" : codeSent ? "Reenviar código" : "Enviar código de verificación"}
              </span>
            </Button>
          )}

          {/* Código + verificar */}
          {codeSent && !codeVerified && (
            <div>
              <p className="text-white/70 text-xs mb-3">
                Se envió un código a <span className="text-white font-semibold">{fields.userEmail}</span>. Ingrésalo abajo.
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
                  onClick={handleVerifyCode}
                  disabled={verifying}
                >
                  {verifying ? "Validando…" : "Verificar"}
                </Button>
              </div>
            </div>
          )}

          {/* Badge verificado */}
          {codeVerified && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-3">
              <CheckCircle size={18} className="text-green-400 shrink-0" />
              <div>
                <p className="text-green-300 font-semibold text-sm">Identidad verificada</p>
                <p className="text-green-400/80 text-xs">{fields.userName || fields.userDoc}</p>
              </div>
            </div>
          )}

        </div>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Guardar cambios
          </Button>
        </div>

      </div>
    </div>
  );
}
