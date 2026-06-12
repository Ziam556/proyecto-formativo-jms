import { useState, useEffect } from "react";
import { Input, Button, Select } from "@/shared";
import { getCategoriesTypes } from "../services/selectService";

export default function CreateReturnable1({ formData, onNext, onCancel }) {
    const [categories, setCategories] = useState([]);
    const [fields, setFields] = useState({
        returnableMaterialId: formData.returnableMaterialId || "",
        materialPlate: formData.materialPlate || "",
        materialCategory: formData.materialCategory || "",
        materialElementName: formData.materialElementName || "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getCategoriesTypes().then(setCategories);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        const newErrors = {};
        if (!fields.returnableMaterialId) newErrors.returnableMaterialId = "El ID es requerido";
        if (!fields.materialPlate) newErrors.materialPlate = "La placa es requerida";
        if (!fields.materialCategory) newErrors.materialCategory = "La categoría es requerida";
        if (!fields.materialElementName) newErrors.materialElementName = "El nombre es requerido";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onNext(fields);
    };

    return (
    <div className="grid grid-cols-[320px_320px] gap-6 mx-auto">
        <Input
            label="ID"
            name="returnableMaterialId"
            placeholder="ID"
            value={fields.returnableMaterialId}
            onChange={handleChange}
            error={errors.returnableMaterialId}
        />
        <Input
            label="Placa SENA"
            name="materialPlate"
            placeholder="Escribe la Placa Sena"
            value={fields.materialPlate}
            onChange={handleChange}
            error={errors.materialPlate}
        />
        <Select
            label="Categoría"
            name="materialCategory"
            value={fields.materialCategory}
            options={categories}
            onChange={handleChange}
            error={errors.materialCategory}
        />
        <Input
            label="Nombre del elemento"
            name="materialElementName"
            placeholder="Escribe el nombre del elemento"
            value={fields.materialElementName}
            onChange={handleChange}
            error={errors.materialElementName}
        />

        <div className="col-span-2 flex justify-end gap-4">
            <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
            <Button variant="primary" size="md" onClick={handleNext}>Siguiente</Button>
        </div>
    </div>
);
}