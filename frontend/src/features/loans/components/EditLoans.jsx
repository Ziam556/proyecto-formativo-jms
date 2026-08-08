import { useState, useEffect } from "react";
import { Input, Button, BackButton, DatePicker, Textarea, Select, alertWarning, alertConfirm } from "@/shared";

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
    loansId:         formData?.loansId         || "",
    fichaGrupo:      formData?.fichaGrupo      || "",
    loanType:        formData?.loanType        || "interno",
    fechaSalida:     formData?.fechaSalida     || "",
    justificacion:   formData?.justificacion   || "",
    usuarioSolicita: formData?.usuarioSolicita || "",
  });

  const [errors, setErrors] = useState({});

  // Sync fields when formData prop updates (after async fetch in parent)
  useEffect(() => {
    setFields({
      loansId:         formData?.loansId         || "",
      fichaGrupo:      formData?.fichaGrupo      || "",
      loanType:        formData?.loanType        || "interno",
      fechaSalida:     formData?.fechaSalida     || "",
      justificacion:   formData?.justificacion   || "",
      usuarioSolicita: formData?.usuarioSolicita || "",
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!fields.fechaSalida)     newErrors.fechaSalida     = "La fecha de salida es requerida";
    if (!fields.usuarioSolicita) newErrors.usuarioSolicita = "El usuario es requerido";
    if (!fields.justificacion)   newErrors.justificacion   = "La justificación es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const missing = Object.values(newErrors);
      await alertWarning(
        "Campos requeridos",
        `Completa los siguientes campos antes de continuar:\n• ${missing.join("\n• ")}`
      );
      return;
    }

    const result = await alertConfirm(
      "¿Guardar cambios?",
      "¿Confirmas que deseas guardar los cambios en este préstamo?"
    );
    if (!result.isConfirmed) return;

    onSave(fields);
  };

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
                <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-white/6 border border-white/12">
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

        <div className="mt-5 max-w-[560px] mx-auto">
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

        <div className="mt-5 max-w-[560px] mx-auto">
          <Input
            label="Usuario solicitante *"
            name="usuarioSolicita"
            value={fields.usuarioSolicita}
            onChange={handleChange}
            error={errors.usuarioSolicita}
          />
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
