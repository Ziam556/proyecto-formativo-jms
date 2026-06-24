import { useState } from "react";
import { Input, Button, FileInput, DatePicker } from "@/shared";
import { returnableStep2Schema } from "../schemas/returnableStep2Schema";

export default function CreateReturnable2({ formData, onNext, onBack }) {
  const [fields, setFields] = useState({
    materialBrand:        formData.materialBrand        || "",
    materialModel:        formData.materialModel        || "",
    materialSerial:       formData.materialSerial       || "",
    materialImage:        formData.materialImage        || [],
    MaterialPurchaseDate: formData.MaterialPurchaseDate || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    // El schema usa "purchaseDate" como nombre genérico; lo mapeamos al campo real del componente.
    const { MaterialPurchaseDate, ...rest } = fields;
    const result = returnableStep2Schema.safeParse({
      ...rest,
      purchaseDate: MaterialPurchaseDate,
    });

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] === "purchaseDate" ? "MaterialPurchaseDate" : issue.path[0];
        if (field && !newErrors[field]) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    onNext(fields);
  };

  return (
    <div className="grid grid-cols-[320px_320px] gap-6">
      <Input
        label="Marca"
        name="materialBrand"
        placeholder="Escribe la marca"
        value={fields.materialBrand}
        onChange={handleChange}
        error={errors.materialBrand}
      />
      <Input
        label="Modelo (opcional)"
        name="materialModel"
        placeholder="Escribe el modelo"
        value={fields.materialModel}
        onChange={handleChange}
      />
      <Input
        label="Serial (opcional)"
        name="materialSerial"
        placeholder="Escribe el serial"
        value={fields.materialSerial}
        onChange={handleChange}
      />

      {/* Imagen — solo PNG, JPG, SVG */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">
          Imagen <span className="text-red-400">*</span>
        </label>
        <FileInput
          value={fields.materialImage}
          onChange={(files) => {
            setFields((prev) => ({ ...prev, materialImage: files }));
            setErrors((prev) => ({ ...prev, materialImage: "" }));
          }}
          accept="image/png,image/jpeg,image/svg+xml"
          multiple={false}
        />
        {errors.materialImage && (
          <span className="text-red-500 text-xs">{errors.materialImage}</span>
        )}
      </div>

      {/* Fecha de compra */}
      <DatePicker
        label="Fecha de compra *"
        name="MaterialPurchaseDate"
        value={fields.MaterialPurchaseDate}
        onChange={handleChange}
        error={errors.MaterialPurchaseDate}
      />

      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}

