import { useState } from "react";
import { Input, Button, FileInput } from "@/shared";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateReturnable2({ formData, onNext, onBack }) {
    const [fields, setFields] = useState({
        materialBrand: formData.materialBrand || "",
        materialModel: formData.materialModel || "",
        materialSerial: formData.materialSerial || "",
        materialImage: formData.materialImage || [],
        MaterialPurchaseDate: formData.MaterialPurchaseDate || null,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        const newErrors = {};
        if (!fields.materialBrand) newErrors.materialBrand = "La marca es requerida";
        if (!fields.materialModel) newErrors.materialModel = "El modelo es requerido";
        if (!fields.materialSerial) newErrors.materialSerial = "El serial es requerido";
        if (!fields.MaterialPurchaseDate) newErrors.MaterialPurchaseDate = "La fecha es requerida";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onNext(fields);
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "320px 320px", gap: "24px" }}>
            <Input
                label="Marca"
                name="materialBrand"
                placeholder="Escribe y busca la marca"
                value={fields.materialBrand}
                onChange={handleChange}
                error={errors.materialBrand}
            />
            <Input
                label="Modelo"
                name="materialModel"
                placeholder="Escribe el modelo"
                value={fields.materialModel}
                onChange={handleChange}
                error={errors.materialModel}
            />
            <Input
                label="Serial"
                name="materialSerial"
                placeholder="Escribe el serial"
                value={fields.materialSerial}
                onChange={handleChange}
                error={errors.materialSerial}
            />

            {/* Input de imagen */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Imagen</label>
                <FileInput
                    value={fields.materialImage}
                    onChange={(files) => setFields((prev) => ({ ...prev, materialImage: files }))}
                    accept="image/*"
                    multiple={false}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Fecha de compra</label>
                <DatePicker
                    selected={fields.MaterialPurchaseDate}
                    onChange={(date) => setFields((prev) => ({ ...prev, MaterialPurchaseDate: date }))}
                    placeholderText="Selecciona la fecha de compra"
                    dateFormat="dd/MM/yyyy"
                    className="w-full rounded-lg px-4 py-3 text-sm"
                    style={{ background: "rgba(220,225,240,0.7)" }}
                />
                {errors.MaterialPurchaseDate && <span className="text-red-500 text-xs">{errors.MaterialPurchaseDate}</span>}
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-2">
                <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
                <Button variant="primary" size="md" onClick={handleNext}>Siguiente</Button>
            </div>
        </div>
    );
}