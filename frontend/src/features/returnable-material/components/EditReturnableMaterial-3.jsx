import { useState } from "react";
import { Input, Button } from "@/shared";
import { buildReturnableStep3Schema } from "../schemas/returnableStep3Schema";

export default function EditReturnableMaterial3({ formData = {}, onNext, onBack }) {
  const hasPlate = !!formData.materialPlate?.trim();

  const [fields, setFields] = useState({
    materialStoryTeller: formData.materialStoryTeller || "",
    materialAmount:      formData.materialAmount      || "",
    materialUnitValue:   formData.materialUnitValue   || "",
    materialTotalValue:  formData.materialTotalValue  || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "materialAmount" || name === "materialUnitValue") {
        const amount    = parseFloat(name === "materialAmount"    ? value : updated.materialAmount)    || 0;
        const unitValue = parseFloat(name === "materialUnitValue" ? value : updated.materialUnitValue) || 0;
        updated.materialTotalValue = amount > 0 && unitValue > 0
          ? (amount * unitValue).toString()
          : "";
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const schema = buildReturnableStep3Schema(hasPlate);
    const result = schema.safeParse(fields);

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
      <Input labelVariant="dark"
        label="Cuentadante (Nombre y apellido)"
        name="materialStoryTeller"
        placeholder="Nombre del cuentadante"
        value={fields.materialStoryTeller}
        onChange={handleChange}
        error={errors.materialStoryTeller}
      />
      <Input labelVariant="dark"
        label={`Cantidad${hasPlate ? " (opcional)" : " *"}`}
        name="materialAmount"
        type="number"
        placeholder="Escribe la cantidad"
        value={fields.materialAmount}
        onChange={handleChange}
        error={errors.materialAmount}
      />
      <Input labelVariant="dark"
        label="Valor unitario"
        name="materialUnitValue"
        type="number"
        placeholder="Valor unitario"
        value={fields.materialUnitValue}
        onChange={handleChange}
        error={errors.materialUnitValue}
      />
      <Input labelVariant="dark"
        label="Valor total (calculado)"
        name="materialTotalValue"
        type="number"
        placeholder="Se calcula automáticamente"
        value={fields.materialTotalValue}
        onChange={() => {}}
        readOnly
        className="opacity-75 cursor-not-allowed"
        error={errors.materialTotalValue}
      />
      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
