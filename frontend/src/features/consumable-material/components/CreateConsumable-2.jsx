import { useState } from "react";
import { Input, Button, FileInput } from "@/shared";
import { consumableStep2Schema } from "../schemas/consumableStep2Schema";

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

        setFields((prev) => {
            const updated = { ...prev, [name]: value };

            // Recalcular valor total automáticamente
            const amount    = parseFloat(name === "materialAmount"    ? value : updated.materialAmount)    || 0;
            const unitValue = parseFloat(name === "materialUnitValue" ? value : updated.materialUnitValue) || 0;
            updated.materialTotalValue = amount > 0 && unitValue > 0 ? (amount * unitValue).toString() : "";

            return updated;
        });

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleNext = () => {
        const result = consumableStep2Schema.safeParse(fields);

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

            

            {/* CUENTADANTE */}
            <Input labelVariant="dark"
                label="Cuentadante"
                name="materialStoryTeller"
                placeholder="Escribe el nombre del cuentadante"
                value={fields.materialStoryTeller}
                onChange={handleChange}
                error={errors.materialStoryTeller}
            />

            {/* CANTIDAD */}
            <Input labelVariant="dark"
                label="Cantidad"
                name="materialAmount"
                type="number"
                placeholder="Escribe la cantidad"
                value={fields.materialAmount}
                onChange={handleChange}
                error={errors.materialAmount}
            />

            {/* VALOR UNITARIO */}
            <Input labelVariant="dark"
                label="Valor unitario"
                name="materialUnitValue"
                type="number"
                placeholder="Escribe el valor unitario"
                value={fields.materialUnitValue}
                onChange={handleChange}
                error={errors.materialUnitValue}
            />

            {/* VALOR TOTAL — calculado automáticamente, no editable */}
            <Input labelVariant="dark"
                label="Valor total (automático)"
                name="materialTotalValue"
                type="number"
                placeholder="Se calcula automáticamente"
                value={fields.materialTotalValue}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
                error={errors.materialTotalValue}
            />

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
                    multiple={true}
                />
            </div>

            {/* BOTONES */}
            <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
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
