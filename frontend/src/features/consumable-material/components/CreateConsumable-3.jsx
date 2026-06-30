import { useState, useEffect } from "react";
import { Input, Button, Select, DatePicker, Textarea, alertSuccess, alertWarning, alertError } from "@/shared";
import { getStateTypes } from "../services/selectService";
import { consumableStep3Schema } from "../schemas/consumableStep3Schema";

export default function CreateConsumable3({ formData, onSave, onBack }) {
    const [states, setStates] = useState([]);

    const [fields, setFields] = useState({
        materialState:       formData.materialState       || "",
        materialDescription: formData.materialDescription || "",
        MaterialPurchaseDate:formData.MaterialPurchaseDate|| "",
        materialLocation:    formData.materialLocation    || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getStateTypes().then(setStates);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const resetForm = () => {
    setFields({
        materialState: "",
        materialDescription: "",
        MaterialPurchaseDate: "",
        materialLocation: "",
    });

    setErrors({});
};

          
    const handleSave = async () => {
        const { MaterialPurchaseDate, ...rest } = fields;
        const result = consumableStep3Schema.safeParse({
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
            alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de guardar.");
            return;
        }


        try {
            onSave(fields);
            await alertSuccess("¡Material Creado!", "El material se registró correctamente.");
            resetForm();
        } catch (err) {
            console.error("Error al guardar material:", err);
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">

            <Select
                label="Estado"
                name="materialState"
                value={fields.materialState}
                options={states}
                onChange={handleChange}
                error={errors.materialState}
            />

            <Textarea
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
