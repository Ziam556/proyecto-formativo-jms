import { useState } from "react";
import { Input, Button } from "@/shared";
import { returnableStep1Schema } from "../schemas/returnableStep1Schema";

export default function EditReturnableMaterial1({ formData = {}, onNext, onCancel }) {
  const [fields, setFields] = useState({
    returnableMaterialId:    formData.returnableMaterialId    || "",
    materialPlate:           formData.materialPlate           || "",
    materialCategory:        formData.materialCategory        || "",
    materialElementName:     formData.materialElementName     || "",
    materialStoryTeller:     formData.materialStoryTeller     || "",
  });
  const [errors, setErrors] = useState({});

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      <Input labelVariant="light"
        label="ID"
        name="returnableMaterialId"
        placeholder="Ej: HER-001"
        value={fields.returnableMaterialId}
        onChange={() => {}}
        readOnly
        className="opacity-60 cursor-not-allowed"
        error={errors.returnableMaterialId}
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
      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
