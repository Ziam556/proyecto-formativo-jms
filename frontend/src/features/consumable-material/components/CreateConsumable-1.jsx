import { useState, useEffect } from "react";
import { Input, Button, alertSuccess, alertError, alertWarning } from "@/shared";
import { getCategoriesTypes } from "../services/selectService";

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
        const newErrors = {};

        if (!fields.consumableMaterialId) {
            newErrors.consumableMaterialId = "El ID es requerido";
        }

        if (!fields.materialPlate) {
            newErrors.materialPlate = "La placa es requerida";
        }

        if (!fields.materialElementName) {
            newErrors.materialElementName = "El nombre es requerido";
        }

        if (!fields.materialBrand) {
            newErrors.materialBrand = "La marca es requerida";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onNext(fields);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">

            <Input
                label="ID"
                name="consumableMaterialId"
                placeholder="Ej:001"
                value={fields.consumableMaterialId}
                onChange={handleChange}
                error={errors.consumableMaterialId}
            />

            <Input
                label="Placa SENA"
                name="materialPlate"
                placeholder="Escribe la placa SENA"
                value={fields.materialPlate}
                onChange={handleChange}
                error={errors.materialPlate}
            />

            <Input
                label="Nombre del elemento"
                name="materialElementName"
                placeholder="Escribe el nombre del elemento"
                value={fields.materialElementName}
                onChange={handleChange}
                error={errors.materialElementName}
            />

            <Input
                label="Marca"
                name="materialBrand"
                placeholder="Escribe la marca"
                value={fields.materialBrand}
                onChange={handleChange}
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