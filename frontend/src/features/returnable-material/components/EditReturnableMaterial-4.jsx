import { useState } from "react";
import { z } from "zod";
import { Input, Button, Select, FileInput, Switch, alertWarning, alertError  } from "@/shared";
import { buildReturnableStep4Schema } from "../schemas/returnableStep4Schema";

// En edición la ficha técnica es opcional (ya existe en el servidor)
const buildEditStep4Schema = (isMuebles) =>
  buildReturnableStep4Schema(isMuebles).extend({
    materialTechnicalSheet: z.array(z.any()).optional(),
  });

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

  const [isEnabled, setIsEnabled] = useState(formData?.isEnabled ?? true);

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
    if (files.length > 0 && files[0].size > MAX_SHEET_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, materialTechnicalSheet: `El archivo supera los ${MAX_SHEET_MB}MB` }));
      return;
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
          Ficha técnica <span className="text-red-400">*</span>
          <span className="text-xs text-gray-400 ml-1">(PDF, PNG o Excel · máx 3MB)</span>
        </label>
        <FileInput
          value={fields.materialTechnicalSheet}
          onChange={handleSheetChange}
          accept="application/pdf,image/png,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple={false}
        />
        {errors.materialTechnicalSheet && (
          <span className="text-red-500 text-xs">{errors.materialTechnicalSheet}</span>
        )}
      </div>

      <Input labelVariant="dark"
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
