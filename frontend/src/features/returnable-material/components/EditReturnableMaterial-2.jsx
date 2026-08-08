import { useState } from "react";
import { z } from "zod";
import { Input, Button, FileInput, BrandSearchField, DatePicker } from "@/shared";
import { returnableStep2Schema } from "../schemas/returnableStep2Schema";

// En edición la imagen es opcional (ya existe en el servidor)
const editStep2Schema = returnableStep2Schema.extend({
  materialImage: z.array(z.any()).optional(),
});

export default function EditReturnableMaterial2({ formData = {}, onNext, onBack }) {
  const [fields, setFields] = useState({
    materialBrand:        formData.materialBrand        || "",
    materialModel:        formData.materialModel        || "",
    materialSerial:       formData.materialSerial       || "",
    materialImage:        formData.materialImage        || [],
    materialPurchaseDate: formData.materialPurchaseDate || "",
    materialEntryDate:    formData.materialEntryDate    || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const result = editStep2Schema.safeParse(fields);

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
      <BrandSearchField
        label="Marca"
        value={fields.materialBrand}
        onChange={(val) => {
          setFields((prev) => ({ ...prev, materialBrand: val }));
          setErrors((prev) => ({ ...prev, materialBrand: "" }));
        }}
        error={errors.materialBrand}
      />
      <Input labelVariant="light"
        label="Modelo (opcional)"
        name="materialModel"
        placeholder="Escribe el modelo"
        value={fields.materialModel}
        onChange={handleChange}
      />
      <Input labelVariant="light"
        label="Serial (opcional)"
        name="materialSerial"
        placeholder="Escribe el serial"
        value={fields.materialSerial}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">
          Imagen <span className="text-xs text-white/50 font-normal ml-1">(dejar vacío para mantener la actual)</span>
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

      <DatePicker labelVariant="light"
        label="Fecha de compra (opcional)"
        name="materialPurchaseDate"
        value={fields.materialPurchaseDate}
        onChange={handleChange}
        error={errors.materialPurchaseDate}
        maxDate={new Date()}
      />

      <DatePicker labelVariant="light"
        label="Fecha de ingreso"
        name="materialEntryDate"
        value={fields.materialEntryDate}
        onChange={handleChange}
        error={errors.materialEntryDate}
        maxDate={new Date()}
        required
      />

      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
