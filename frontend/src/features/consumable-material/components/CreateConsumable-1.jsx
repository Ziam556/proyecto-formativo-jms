import { useState, useEffect } from "react";
import { Input, Button, BrandSearchField, alertSuccess, alertError, alertWarning } from "@/shared";
import { getCategoriesTypes } from "../services/selectService";
import { consumableStep1Schema } from "../schemas/consumableStep1Schema";
import { getConsumableMaterials } from "../services/consumableMaterialService";

function generateNextConsumableId(existingIds) {
    const prefix = "CON";
    const nums = existingIds
        .filter((id) => typeof id === "string" && id.startsWith(prefix + "-"))
        .map((id) => parseInt(id.split("-")[1], 10))
        .filter((n) => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export default function CreateConsumable1({
    formData = {},
    onNext,
    onCancel,
}) {
    const [categories, setCategories] = useState([]);

    const [fields, setFields] = useState({
        consumableMaterialId: formData?.consumableMaterialId || "",
        materialPlate:        formData?.materialPlate        || "",
        materialElementName:  formData?.materialElementName  || "",
        materialBrand:        formData?.materialBrand        || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getCategoriesTypes().then(setCategories);
    }, []);

    // Generar ID automático al montar (solo si no hay ID previo)
    useEffect(() => {
        if (fields.consumableMaterialId) return;
        getConsumableMaterials()
            .then((rows) => {
                const existingIds = rows.map((r) => r.consumable_material_id);
                const nextId = generateNextConsumableId(existingIds);
                setFields((prev) => ({ ...prev, consumableMaterialId: nextId }));
            })
            .catch(() => {});
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
                value={fields.consumableMaterialId}
                onChange={() => {}}
                error={errors.consumableMaterialId}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
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
