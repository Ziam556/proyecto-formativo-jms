import { useState, useEffect } from "react";
import { Input, Button, BrandSearchField, Select, alertSuccess, alertError, alertWarning } from "@/shared";
import { getCategories } from "@/features/categories/services/categoryService";
import { getInventories } from "@/features/inventories/services/inventoryService";
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
    const [categoryOptions, setCategoryOptions]   = useState([]);
    const [inventoryOptions, setInventoryOptions] = useState([]);

    const [fields, setFields] = useState({
        consumableMaterialId: formData?.consumableMaterialId || "",
        materialPlate:        formData?.materialPlate        || "",
        materialCategory:     formData?.materialCategory     || "",
        materialElementName:  formData?.materialElementName  || "",
        materialBrand:        formData?.materialBrand        || "",
        materialInventory:    formData?.materialInventory    || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getCategories()
            .then((cats) =>
                setCategoryOptions(
                    cats
                        .filter((c) => c.enabled)
                        .map((c) => ({ id: c.name, label: c.name }))
                )
            )
            .catch(() => {});
        getInventories()
            .then((invs) =>
                setInventoryOptions(
                    invs
                        .filter((i) => i.enabled)
                        .map((i) => ({ id: i.name, label: i.name }))
                )
            )
            .catch(() => {});
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

            <Select labelVariant="light"
                label="Categoría (opcional)"
                name="materialCategory"
                value={fields.materialCategory}
                options={categoryOptions}
                onChange={handleChange}
                error={errors.materialCategory}
                placeholder="Selecciona una categoría"
            />

            <BrandSearchField
                label="Marca (opcional)"
                value={fields.materialBrand}
                onChange={(val) => {
                    setFields((prev) => ({ ...prev, materialBrand: val }));
                    setErrors((prev) => ({ ...prev, materialBrand: "" }));
                }}
                error={errors.materialBrand}
            />

            <Select labelVariant="light"
                label="Nombre de inventario (opcional)"
                name="materialInventory"
                value={fields.materialInventory}
                options={inventoryOptions}
                onChange={handleChange}
                error={errors.materialInventory}
                placeholder="Selecciona un inventario"
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
