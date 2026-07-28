import { useState } from "react";
import { z } from "zod";
import { Input, Textarea, Button, Select, FileInput, Switch, alertWarning, alertError  } from "@/shared";
import { buildReturnableStep4Schema } from "../schemas/returnableStep4Schema";
import { FileText } from "lucide-react";

// En edición la ficha técnica es opcional (ya existe en el servidor)
const buildEditStep4Schema = (isMuebles) =>
  buildReturnableStep4Schema(isMuebles).extend({
    materialTechnicalSheet: z.array(z.any()).optional(),
  });

// Extrae solo el nombre de archivo de una ruta como "uploads/returnable/ficha.pdf"
function sheetFileName(url) {
  if (!url) return null;
  return url.split("/").pop();
}

const STATE_OPTIONS = [
  { value: "Disponible",    label: "Disponible" },
  { value: "No disponible", label: "No disponible" },
  { value: "Mantenimiento", label: "Mantenimiento" },
  { value: "En préstamo",   label: "En préstamo" },
  { value: "Traslado",      label: "Traslado" },
  { value: "Baja",          label: "Baja" },
];

const MAX_SHEET_MB = 3;

export default function EditReturnableMaterial4({ formData = {}, onSave, onBack }) {
  const isMuebles = formData.materialCategory === "Muebles y enseres";
  const currentSheetUrl = formData.materialTechnicalSheetUrl || null;

  const [isEnabled, setIsEnabled]   = useState(formData?.isEnabled ?? true);
  const [sheetRemoved, setSheetRemoved] = useState(false);

  const [fields, setFields] = useState({
    materialState:          formData.materialState          || "",
    materialTechnicalSheet: formData.materialTechnicalSheet || [],
    materialDescription:    formData.materialDescription    || "",
    materialLocation:       formData.materialLocation       || "",
    materialWidth:          formData.materialWidth          || "",
    materialLength:         formData.materialLength         || "",
    materialDepth:          formData.materialDepth          || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSheetChange = (files) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, materialTechnicalSheet: "Solo se permiten archivos PDF" }));
        return;
      }
      if (file.size > MAX_SHEET_MB * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, materialTechnicalSheet: `El archivo supera los ${MAX_SHEET_MB}MB` }));
        return;
      }
    }
    setFields((prev) => ({ ...prev, materialTechnicalSheet: files }));
    setErrors((prev) => ({ ...prev, materialTechnicalSheet: "" }));
  };

  const handleSave = () => {
    const schema = buildEditStep4Schema(isMuebles);
    const result = schema.safeParse(fields);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && !newErrors[field]) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de guardar.");
      return;
    }
    try {
            onSave({ ...fields, isEnabled });
        } catch (err) {
            console.error("Error al guardar material:", err);
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      <Select labelVariant="dark"
        label="Estado"
        name="materialState"
        value={fields.materialState}
        options={STATE_OPTIONS}
        onChange={handleChange}
        error={errors.materialState}
        placeholder="Selecciona un estado"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">
          Ficha técnica
          <span className="text-xs text-black ml-1">(Solo PDF · máx 3MB · dejar vacío para mantener el actual)</span>
        </label>

        {/* Caso 1: el usuario acaba de seleccionar un archivo nuevo */}
        {fields.materialTechnicalSheet?.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white/80">
            <FileText size={14} className="shrink-0 text-cyan-400" />
            <span className="truncate flex-1">{fields.materialTechnicalSheet[0].name}</span>
            <button
              type="button"
              onClick={() => setFields((prev) => ({ ...prev, materialTechnicalSheet: [] }))}
              className="shrink-0 text-red-400 hover:text-red-300 font-semibold px-1"
            >
              Eliminar
            </button>
          </div>

        ) : currentSheetUrl && !sheetRemoved ? (
          /* Caso 2: existe archivo en el servidor y no se ha eliminado → mostrar nombre + Eliminar, sin FileInput */
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white/80">
            <FileText size={14} className="shrink-0 text-cyan-400" />
            <span className="truncate flex-1">
              doc - <strong>{sheetFileName(currentSheetUrl)}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSheetRemoved(true)}
              className="shrink-0 text-red-400 hover:text-red-300 font-semibold px-1"
            >
              Eliminar
            </button>
          </div>

        ) : (
          /* Caso 3: sin archivo (nunca tuvo o el usuario eliminó) → mostrar selector */
          <FileInput
            value={fields.materialTechnicalSheet}
            onChange={handleSheetChange}
            accept="application/pdf"
            multiple={false}
          />
        )}

        {errors.materialTechnicalSheet && (
          <span className="text-red-500 text-xs">{errors.materialTechnicalSheet}</span>
        )}
      </div>

      <Textarea
        label="Descripción"
        name="materialDescription"
        placeholder="Escribe la descripción"
        value={fields.materialDescription}
        onChange={handleChange}
        error={errors.materialDescription}
      />
      <Input labelVariant="dark"
        label="Ubicación (opcional)"
        name="materialLocation"
        placeholder="Escribe la ubicación"
        value={fields.materialLocation}
        onChange={handleChange}
      />

      {/* SWITCH HABILITAR / DESHABILITAR */}
      <div className="flex flex-col gap-1 justify-end">
        <label className="text-sm font-medium text-white">
          Estado del material
        </label>
        <div className="flex items-center gap-3 h-12">
          <Switch checked={isEnabled} onChange={setIsEnabled} />
          <span className="text-sm font-semibold text-white">
            {isEnabled ? "Habilitado" : "Deshabilitado"}
          </span>
        </div>
      </div>

      {isMuebles && (
        <>
          <Input labelVariant="dark"
            label="Ancho (cm)"
            name="materialWidth"
            type="number"
            placeholder="Ancho"
            value={fields.materialWidth}
            onChange={handleChange}
            error={errors.materialWidth}
          />
          <Input labelVariant="dark"
            label="Largo (cm)"
            name="materialLength"
            type="number"
            placeholder="Largo"
            value={fields.materialLength}
            onChange={handleChange}
            error={errors.materialLength}
          />
          <Input labelVariant="dark"
            label="Profundidad (cm)"
            name="materialDepth"
            type="number"
            placeholder="Profundidad"
            value={fields.materialDepth}
            onChange={handleChange}
            error={errors.materialDepth}
          />
        </>
      )}

      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleSave}>Guardar cambios</Button>
      </div>
    </div>
  );
}
