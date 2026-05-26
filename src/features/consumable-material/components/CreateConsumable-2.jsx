import { useState } from "react";
import { Input, Button, FileInput } from "@/shared";

export default function CreateConsumable2({
    formData = {},
    onNext,
    onBack,
}) {
    const [fields, setFields] = useState({
        materialImage: formData?.materialImage || [],
        materialStoryTeller: formData?.materialStoryTeller || "",
        materialAmount: formData?.materialAmount || "",
        materialUnitValue: formData?.materialUnitValue || "",
        materialTotalValue: formData?.materialTotalValue || "",
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
        const newErrors = {};

        if (!fields.materialStoryTeller) {
            newErrors.materialStoryTeller =
                "El cuentadante es requerido";
        }

        if (!fields.materialAmount) {
            newErrors.materialAmount =
                "La cantidad es requerida";
        }

        if (!fields.materialUnitValue) {
            newErrors.materialUnitValue =
                "El valor unitario es requerido";
        }

        if (!fields.materialTotalValue) {
            newErrors.materialTotalValue =
                "El valor total es requerido";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onNext(fields);
    };

    return (
        <div className="grid grid-cols-2 gap-6 w-full">

            {/* IMAGEN */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">
                    Imagen
                </label>

                <FileInput
                    value={fields.materialImage}
                    onChange={(files) =>
                        setFields((prev) => ({
                            ...prev,
                            materialImage: files,
                        }))
                    }
                    accept="image/*"
                    multiple={false}
                />
            </div>

            {/* CUENTADANTE */}
            <Input
                label="Cuentadante"
                name="materialStoryTeller"
                placeholder="Escribe el nombre del cuentadante"
                value={fields.materialStoryTeller}
                onChange={handleChange}
                error={errors.materialStoryTeller}
            />

            {/* CANTIDAD */}
            <Input
                label="Cantidad"
                name="materialAmount"
                type="number"
                placeholder="Escribe la cantidad"
                value={fields.materialAmount}
                onChange={handleChange}
                error={errors.materialAmount}
            />

            {/* VALOR UNITARIO */}
            <Input
                label="Valor unitario"
                name="materialUnitValue"
                type="number"
                placeholder="Escribe el valor unitario"
                value={fields.materialUnitValue}
                onChange={handleChange}
                error={errors.materialUnitValue}
            />

            {/* VALOR TOTAL */}
            <Input
                label="Valor total"
                name="materialTotalValue"
                type="number"
                placeholder="Escribe el valor total"
                value={fields.materialTotalValue}
                onChange={handleChange}
                error={errors.materialTotalValue}
            />

            {/* BOTONES */}
            <div className="col-span-2 flex justify-end gap-4 mt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBack}
                >
                    Atrás
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