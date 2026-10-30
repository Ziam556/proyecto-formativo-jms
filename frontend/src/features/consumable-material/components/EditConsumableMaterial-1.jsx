import { useState, useEffect } from "react";
import { Input, Button, BrandSearchField, Select, InventorySelectField, CategorySelectField } from "@/shared";
import { consumableStep1Schema } from "../schemas/consumableStep1Schema";

export default function EditConsumableMaterial1({
    formData = {},
    onNext,
    onCancel,
}) {
    const [fields, setFields] = useState({
        consumableMaterialId: formData?.consumableMaterialId || "",
        materialPlate:        formData?.materialPlate        || "",
        materialCategory:     formData?.materialCategory     || "",
        materialBrand:        formData?.materialBrand        || "",
        materialElementName:  formData?.materialElementName  || "",
        materialInventory:    formData?.materialInventory    || "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFields((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleNext = () => {
        const result = consumableStep1Schema.safeParse(fields);

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

        <div className="grid grid-cols-1 @[500px]:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">

            <Input labelVariant="light"
                label="Número de serie (SN) (opcional)"
                name="consumableMaterialId"
                placeholder="Ej: CON-001"
                value={fields.consumableMaterialId}
                onChange={handleChange}
                error={errors.consumableMaterialId}
            />

            <Input labelVariant="light"
                label="Placa SENA"
                name="materialPlate"
                placeholder="Escribe la placa SENA"
                value={fields.materialPlate}
                onChange={handleChange}
                error={errors.materialPlate}
            />

            <Input labelVariant="light"
                label="Nombre del elemento"
                name="materialElementName"
                placeholder="Escribe el nombre del elemento"
                value={fields.materialElementName}
                onChange={handleChange}
                error={errors.materialElementName}
                required
            />

            <CategorySelectField
                labelVariant="light"
                label="Tipo de material"
                name="materialCategory"
                value={fields.materialCategory}
                onChange={handleChange}
                error={errors.materialCategory}
                required
            />

            <BrandSearchField
                label="Marca"
                value={fields.materialBrand}
                onChange={(val) => {
                    setFields((prev) => ({ ...prev, materialBrand: val }));
                    setErrors((prev) => ({ ...prev, materialBrand: "" }));
                }}
                error={errors.materialBrand}
            />

            <InventorySelectField
                labelVariant="light"
                value={fields.materialInventory}
                onChange={handleChange}
                name="materialInventory"
                error={errors.materialInventory}
            />

            {/* BOTONES */}
            <div className="@[500px]:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                >
                    Siguiente
                </Button>
            </div>

        </div>

    );
}
