import { useState } from "react";
import { Input, Button, Select, FileInput } from "@/shared";

const STATE_OPTIONS = [
  { value: "Disponible",    label: "Disponible" },
  { value: "No disponible", label: "No disponible" },
  { value: "Mantenimiento", label: "Mantenimiento" },
  { value: "En préstamo",   label: "En préstamo" },
  { value: "Traslado",      label: "Traslado" },
  { value: "Baja",          label: "Baja" },
];

const MAX_SHEET_MB = 3;

export default function CreateReturnable4({ formData, onSave, onBack }) {
  const isMuebles = formData.materialCategory === "Muebles y enseres";

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
      if (file.size > MAX_SHEET_MB * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, materialTechnicalSheet: `El archivo supera los ${MAX_SHEET_MB}MB` }));
        return;
      }
    }
    setFields((prev) => ({ ...prev, materialTechnicalSheet: files }));
    setErrors((prev) => ({ ...prev, materialTechnicalSheet: "" }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!fields.materialState)                   newErrors.materialState          = "El estado es requerido";
    if (!fields.materialTechnicalSheet?.length)  newErrors.materialTechnicalSheet = "La ficha técnica es requerida";
    if (!fields.materialDescription)             newErrors.materialDescription    = "La descripción es requerida";
    if (isMuebles) {
      if (!fields.materialWidth)  newErrors.materialWidth  = "El ancho es requerido";
      if (!fields.materialLength) newErrors.materialLength = "El largo es requerido";
      if (!fields.materialDepth)  newErrors.materialDepth  = "La profundidad es requerida";
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(fields);
  };

  return (
    <div className="grid grid-cols-[320px_320px] gap-6">
      <Select
        label="Estado"
        name="materialState"
        value={fields.materialState}
        options={STATE_OPTIONS}
        onChange={handleChange}
        error={errors.materialState}
        placeholder="Selecciona un estado"
      />

      {/* Ficha técnica — PDF, PNG o Excel, máx 3 MB */}
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

      <Input
        label="Descripción"
        name="materialDescription"
        placeholder="Escribe la descripción"
        value={fields.materialDescription}
        onChange={handleChange}
        error={errors.materialDescription}
      />
      <Input
        label="Ubicación (opcional)"
        name="materialLocation"
        placeholder="Escribe la ubicación"
        value={fields.materialLocation}
        onChange={handleChange}
      />

      {/* Dimensiones — solo visibles si categoría es Muebles y enseres */}
      {isMuebles && (
        <>
          <Input
            label="Ancho (cm)"
            name="materialWidth"
            type="number"
            placeholder="Ancho"
            value={fields.materialWidth}
            onChange={handleChange}
            error={errors.materialWidth}
          />
          <Input
            label="Largo (cm)"
            name="materialLength"
            type="number"
            placeholder="Largo"
            value={fields.materialLength}
            onChange={handleChange}
            error={errors.materialLength}
          />
          <Input
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

      <div className="col-span-2 flex justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleSave}>Guardar material devolutivo</Button>
      </div>
    </div>
  );
}
