
import { useState, useEffect } from "react";
import { Input, Button, Select } from "@/shared";
import { returnableStep1Schema } from "../schemas/returnableStep1Schema";
import { getReturnableMaterials } from "../services/returnableMaterialService";

const CATEGORY_OPTIONS = [
  { value: "Herramienta",          label: "Herramienta" },
  { value: "Maquinaria y equipos", label: "Maquinaria y equipos" },
  { value: "Muebles y enseres",    label: "Muebles y enseres" },
];

const PREFIX_MAP = {
  "Herramienta":          "HER",
  "Maquinaria y equipos": "MAQ",
  "Muebles y enseres":    "MUE",
};

function generateNextId(existingIds, prefix) {
  const nums = existingIds
    .filter((id) => typeof id === "string" && id.startsWith(prefix + "-"))
    .map((id) => parseInt(id.split("-")[1], 10))
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export default function CreateReturnable1({ formData, onNext, onCancel }) {
  const [fields, setFields] = useState({
    returnableMaterialId: formData.returnableMaterialId || "",
    materialPlate:        formData.materialPlate        || "",
    materialCategory:     formData.materialCategory     || "",
    materialElementName:  formData.materialElementName  || "",
    materialStoryTeller:  formData.materialStoryTeller  || "",
  });
  const [errors, setErrors]       = useState({});
  const [existingIds, setExistingIds] = useState([]);

  // Cargar IDs existentes al montar
  useEffect(() => {
    getReturnableMaterials()
      .then((rows) => setExistingIds(rows.map((r) => r.returnable_material_id)))
      .catch(() => {});
  }, []);

  // Re-generar ID cada vez que cambia la categoría o los IDs existentes
  useEffect(() => {
    if (!fields.materialCategory) return;
    const prefix = PREFIX_MAP[fields.materialCategory];
    if (!prefix) return;
    const nextId = generateNextId(existingIds, prefix);
    setFields((prev) => ({ ...prev, returnableMaterialId: nextId }));
  }, [fields.materialCategory, existingIds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const result = returnableStep1Schema.safeParse(fields);
    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && !newErrors[field]) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    onNext(fields);
  };

  return (
    <div className="grid grid-cols-[320px_320px] gap-6 mx-auto">
      <Input labelVariant="light"
        label="ID"
        name="returnableMaterialId"
        value={fields.returnableMaterialId}
        onChange={() => {}}
        error={errors.returnableMaterialId}
        readOnly
        className="opacity-60 cursor-not-allowed"
      />
      <Input labelVariant="light"
        label="Placa SENA"
        name="materialPlate"
        placeholder="Escribe la placa SENA"
        value={fields.materialPlate}
        onChange={handleChange}
        error={errors.materialPlate}
        required
      />
      <Select labelVariant="light"
        label="Categoría"
        name="materialCategory"
        value={fields.materialCategory}
        options={CATEGORY_OPTIONS}
        onChange={handleChange}
        error={errors.materialCategory}
        placeholder="Selecciona una categoría"
        required
      />
      <Input labelVariant="light"
        label="Nombre del elemento"
        name="materialElementName"
        placeholder="Escribe el nombre del elemento"
        value={fields.materialElementName}
        onChange={handleChange}
        error={errors.materialElementName}
        required
      />
      <Input labelVariant="light"
        label="Cuentadante (Nombre y apellido)"
        name="materialStoryTeller"
        placeholder="Escribe el nombre del cuentadante"
        value={fields.materialStoryTeller}
        onChange={handleChange}
        error={errors.materialStoryTeller}
        required
      />
      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
