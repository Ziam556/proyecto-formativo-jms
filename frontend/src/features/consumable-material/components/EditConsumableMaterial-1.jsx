import { useState, useEffect } from "react";
import { Input, Button, BrandSearchField } from "@/shared";
import { getCategoriesTypes } from "../services/selectService";
import { consumableStep1Schema } from "../schemas/consumableStep1Schema";

export default function EditConsumableMaterial1({
    formData = {},
    onNext,
    onCancel,
}) {
    const [categories, setCategories] = useState([]);

    const [fields, setFields] = useState({
        consumableMaterialId:
            formData?.consumableMaterialId || "",
        materialPlate: formData?.materialPlate || "",
        materialBrand: formData?.materialBrand || "",
        materialElementName:
            formData?.materialElementName || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getCategoriesTypes().then(setCategories);
    }, []);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">

            <Input labelVariant="dark"
                label="ID"
                name="consumableMaterialId"
                placeholder="ID"
                value={fields.consumableMaterialId}
                onChange={() => {}}
                readOnly
                className="opacity-60 cursor-not-allowed"
                error={errors.consumableMaterialId}
            />

            <Input labelVariant="dark"
                label="Placa SENA"
                name="materialPlate"
                placeholder="Escribe la placa SENA"
                value={fields.materialPlate}
                onChange={handleChange}
                error={errors.materialPlate}
            />

            <Input labelVariant="dark"
                label="Nombre del elemento"
                name="materialElementName"
                placeholder="Escribe el nombre del elemento"
                value={fields.materialElementName}
                onChange={handleChange}
                error={errors.materialElementName}
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

            {/* BOTONES */}
            <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
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
