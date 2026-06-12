import { useState } from "react";
import { Input, Button, FileInput } from "@/shared";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateReturnable2({ formData, onNext, onBack }) {
  const [fields, setFields] = useState({
    materialBrand:        formData.materialBrand        || "",
    materialModel:        formData.materialModel        || "",
    materialSerial:       formData.materialSerial       || "",
    materialImage:        formData.materialImage        || [],
    MaterialPurchaseDate: formData.MaterialPurchaseDate || null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const newErrors = {};
    if (!fields.materialBrand)              newErrors.materialBrand        = "La marca es requerida";
    if (!fields.materialImage?.length)      newErrors.materialImage        = "La imagen es requerida";
    if (!fields.MaterialPurchaseDate)       newErrors.MaterialPurchaseDate = "La fecha es requerida";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
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
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">
          Fecha de compra <span className="text-red-400">*</span>
        </label>
        <DatePicker
          selected={fields.MaterialPurchaseDate}
          onChange={(date) => {
            setFields((prev) => ({ ...prev, MaterialPurchaseDate: date }));
            setErrors((prev) => ({ ...prev, MaterialPurchaseDate: "" }));
          }}
          placeholderText="Selecciona la fecha"
          dateFormat="dd/MM/yyyy"
          className="w-full rounded-lg px-4 py-3 text-sm bg-[rgba(220,225,240,0.7)]"
        />
        {errors.MaterialPurchaseDate && (
          <span className="text-red-500 text-xs">{errors.MaterialPurchaseDate}</span>
        )}
      </div>

      <div className="col-span-2 flex justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}

