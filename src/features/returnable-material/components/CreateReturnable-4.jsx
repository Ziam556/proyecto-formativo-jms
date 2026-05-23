import { useState, useEffect } from "react";
import { Input, Button, Select, FileInput } from "@/shared";
import { getStateTypes, getDimensionsTypes } from "../services/selectService";

export default function CreateReturnable4({ formData, onSave, onBack }) {
    const [states, setStates] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    const [fields, setFields] = useState({
        materialState: formData.materialState || "",
        materialTechnicalSheet: formData.materialTechnicalSheet || [],
        materialDescription: formData.materialDescription || "",
        materialLocation: formData.materialLocation || "",
        materialDimensions: formData.materialDimensions || "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getStateTypes().then(setStates);
        getDimensionsTypes().then(setDimensions);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const newErrors = {};
        if (!fields.materialState) newErrors.materialState = "El estado es requerido";
        if (!fields.materialDescription) newErrors.materialDescription = "La descripción es requerida";
        if (!fields.materialLocation) newErrors.materialLocation = "La ubicación es requerida";
        if (!fields.materialDimensions) newErrors.materialDimensions = "Las dimensiones son requeridas";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave(fields);
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "320px 320px", gap: "24px" }}>
            <Select
                label="Estado"
                name="materialState"
                value={fields.materialState}
                options={states}
                onChange={handleChange}
                error={errors.materialState}
            />

            {/* Ficha técnica */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">Ficha técnica</label>
                <FileInput
                    value={fields.materialTechnicalSheet}
                    onChange={(files) => setFields((prev) => ({ ...prev, materialTechnicalSheet: files }))}
                    accept="application/pdf"
                    multiple={false}
                />
            </div>

            <Input
                label="Descripción"
                name="materialDescription"
                placeholder="Escribe la descripción aquí"
                value={fields.materialDescription}
                onChange={handleChange}
                error={errors.materialDescription}
            />
            <Input
                label="Ubicación"
                name="materialLocation"
                placeholder="Escribe la ubicación del material"
                value={fields.materialLocation}
                onChange={handleChange}
                error={errors.materialLocation}
            />
            <Select
                label="Dimensiones"
                name="materialDimensions"
                value={fields.materialDimensions}
                options={dimensions}
                onChange={handleChange}
                error={errors.materialDimensions}
            />

            <div className="col-span-2 flex justify-end gap-4 mt-2">
                <Button variant="secondary" size="sm" onClick={onBack}>Atrás</Button>
                <Button variant="primary" size="md" onClick={handleSave}>Guardar material devolutivo</Button>
            </div>
        </div>
    );
}