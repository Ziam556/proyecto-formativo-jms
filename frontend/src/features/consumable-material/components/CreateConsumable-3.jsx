import { useState, useEffect } from "react";
import { Input, Button, Select, DatePicker } from "@/shared";
import { getStateTypes } from "../services/selectService";

export default function CreateConsumable3({ formData, onSave, onBack }) {
  const [states, setStates] = useState([]);

  const [fields, setFields] = useState({
    materialState: formData.materialState || "",
    materialDescription: formData.materialDescription || "",
    MaterialPurchaseDate: formData.MaterialPurchaseDate || "",
    materialLocation: formData.materialLocation || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getStateTypes().then(setStates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (!fields.materialState)
      newErrors.materialState = "El estado es requerido";

    if (!fields.materialDescription)
      newErrors.materialDescription = "La descripción es requerida";

    if (!fields.MaterialPurchaseDate)
      newErrors.MaterialPurchaseDate = "La fecha es requerida";

    if (!fields.materialLocation)
      newErrors.materialLocation = "La ubicación es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(fields);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      <Select
        label="Estado"
        name="materialState"
        value={fields.materialState}
        options={states}
        onChange={handleChange}
        error={errors.materialState}
      />

      <Input
        label="Descripción"
        name="materialDescription"
        placeholder="Escribe la descripción aquí"
        value={fields.materialDescription}
        onChange={handleChange}
        error={errors.materialDescription}
      />

      <DatePicker
        label="Fecha de compra"
        name="MaterialPurchaseDate"
        value={fields.MaterialPurchaseDate}
        onChange={handleChange}
        error={errors.MaterialPurchaseDate}
      />

      <Input
        label="Ubicación"
        name="materialLocation"
        placeholder="Escribe la ubicación del material"
        value={fields.materialLocation}
        onChange={handleChange}
        error={errors.materialLocation}
      />

      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>
          Atrás
        </Button>

        <Button variant="primary" size="md" onClick={handleSave}>
          Guardar material de consumo
        </Button>
      </div>

    </div>
  );
}