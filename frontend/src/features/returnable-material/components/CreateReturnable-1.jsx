import { useState } from "react";
import { Input, Button, Select } from "@/shared";

const CATEGORY_OPTIONS = [
  { value: "Herramienta",          label: "Herramienta" },
  { value: "Maquinaria y equipos", label: "Maquinaria y equipos" },
  { value: "Muebles y enseres",    label: "Muebles y enseres" },
];

export default function CreateReturnable1({ formData, onNext, onCancel }) {
  const [fields, setFields] = useState({
    returnableMaterialId:        formData.returnableMaterialId        || "",
    materialPlate:       formData.materialPlate       || "",
    materialCategory:    formData.materialCategory    || "",
    materialElementName: formData.materialElementName || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const newErrors = {};
    if (!fields.returnableMaterialId)        newErrors.returnableMaterialId        = "El código es requerido";
    if (!fields.materialPlate)       newErrors.materialPlate       = "La placa es requerida";
    if (!fields.materialCategory)    newErrors.materialCategory    = "La categoría es requerida";
    if (!fields.materialElementName) newErrors.materialElementName = "El nombre es requerido";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onNext(fields);
  };

  return (
    <div className="grid grid-cols-[320px_320px] gap-6 mx-auto">
      <Input
        label="ID"
        name="returnableMaterialId"
        placeholder="Ej: HER-001"
        value={fields.returnableMaterialId}
        onChange={handleChange}
        error={errors.returnableMaterialId}
      />
      <Input
        label="Placa SENA"
        name="materialPlate"
        placeholder="Escribe la placa SENA"
        value={fields.materialPlate}
        onChange={handleChange}
        error={errors.materialPlate}
      />
      <Select
        label="Categoría"
        name="materialCategory"
        value={fields.materialCategory}
        options={CATEGORY_OPTIONS}
        onChange={handleChange}
        error={errors.materialCategory}
        placeholder="Selecciona una categoría"
      />
      <Input
        label="Nombre del elemento"
        name="materialElementName"
        placeholder="Escribe el nombre del elemento"
        value={fields.materialElementName}
        onChange={handleChange}
        error={errors.materialElementName}
      />
      <div className="col-span-2 flex justify-end gap-4">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
