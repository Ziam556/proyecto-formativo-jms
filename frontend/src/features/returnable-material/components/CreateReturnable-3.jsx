import { useState } from "react";
import { Input, Button } from "@/shared";

export default function CreateReturnable3({ formData, onNext, onBack }) {
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
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const newErrors = {};
    if (!fields.materialStoryTeller) newErrors.materialStoryTeller = "El cuentadante es requerido";
    if (!hasPlate && !fields.materialAmount) newErrors.materialAmount = "La cantidad es requerida cuando no hay placa";
    if (!fields.materialUnitValue)   newErrors.materialUnitValue   = "El valor unitario es requerido";
    if (!fields.materialTotalValue)  newErrors.materialTotalValue  = "El valor total es requerido";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onNext(fields);
  };

  return (
    <div className="grid grid-cols-[320px_320px] gap-6">
      <Input
        label="Cuentadante"
        name="materialStoryTeller"
        placeholder="Nombre del cuentadante"
        value={fields.materialStoryTeller}
        onChange={handleChange}
        error={errors.materialStoryTeller}
      />

      {/* Cantidad: solo obligatoria si no tiene placa */}
      <Input
        label={`Cantidad${hasPlate ? " (opcional)" : " *"}`}
        name="materialAmount"
        type="number"
        placeholder="Escribe la cantidad"
        value={fields.materialAmount}
        onChange={handleChange}
        error={errors.materialAmount}
      />

      <Input
        label="Valor unitario"
        name="materialUnitValue"
        type="number"
        placeholder="Valor unitario"
        value={fields.materialUnitValue}
        onChange={handleChange}
        error={errors.materialUnitValue}
      />
      <Input
        label="Valor total"
        name="materialTotalValue"
        type="number"
        placeholder="Valor total"
        value={fields.materialTotalValue}
        onChange={handleChange}
        error={errors.materialTotalValue}
      />

      <div className="col-span-2 flex justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}

