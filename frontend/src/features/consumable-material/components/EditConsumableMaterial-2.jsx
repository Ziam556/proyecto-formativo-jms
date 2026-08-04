import { useState } from "react";
import { Button, FileInput, Input, Switch, MultiUserSearchField } from "@/shared";
import { consumableStep2Schema } from "../schemas/consumableStep2Schema";

export default function EditConsumableMaterial2({
    formData = {},
    onNext,
    onBack,
}) {
    const [isEnabled, setIsEnabled] = useState(formData?.isEnabled ?? true);

    const [fields, setFields] = useState({
        materialImage:       formData?.materialImage       || [],
        materialStoryTeller: formData?.materialStoryTeller || [],
        materialAmount:      formData?.materialAmount      || "",
        materialUnitValue:   formData?.materialUnitValue   || "",
        materialTotalValue:  formData?.materialTotalValue  || "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "materialAmount" || name === "materialUnitValue") {
                const amount    = parseFloat(name === "materialAmount"    ? value : updated.materialAmount)    || 0;
                const unitValue = parseFloat(name === "materialUnitValue" ? value : updated.materialUnitValue) || 0;
                updated.materialTotalValue = amount > 0 && unitValue > 0
                    ? (amount * unitValue).toString()
                    : "";
            }
            return updated;
        });
        setErrors((prev) => ({ ...prev, [name]: "" }));
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

        onNext({ ...fields, isEnabled });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[600px] mx-auto">

            {/* IMAGEN */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-white">
                    Imagen
                </label>
                <FileInput
                    value={fields.materialImage}
                    onChange={(files) =>
                        setFields((prev) => ({ ...prev, materialImage: files }))
                    }
                    accept="image/*"
                    multiple={false}
                />
            </div>

            {/* CUENTADANTE(S) */}
            <MultiUserSearchField
                label="Cuentadante(s)"
                value={fields.materialStoryTeller}
                onChange={(arr) => {
                    setFields((prev) => ({ ...prev, materialStoryTeller: arr }));
                    setErrors((prev) => ({ ...prev, materialStoryTeller: "" }));
                }}
                error={errors.materialStoryTeller}
                required
            />

            {/* CANTIDAD */}
            <Input labelVariant="light"
                label="Cantidad"
                name="materialAmount"
                type="number"
                placeholder="Escribe la cantidad"
                value={fields.materialAmount}
                onChange={handleChange}
                error={errors.materialAmount}
                required
            />

            {/* VALOR UNITARIO */}
            <Input labelVariant="light"
                label="Valor unitario"
                name="materialUnitValue"
                type="number"
                placeholder="Escribe el valor unitario"
                value={fields.materialUnitValue}
                onChange={handleChange}
                error={errors.materialUnitValue}
                required
            />

            {/* VALOR TOTAL (auto-calculado) */}
            <Input labelVariant="light"
                label="Valor total (calculado)"
                name="materialTotalValue"
                type="number"
                placeholder="Se calcula automáticamente"
                value={fields.materialTotalValue}
                onChange={() => {}}
                readOnly
                className="opacity-75 cursor-not-allowed"
                error={errors.materialTotalValue}
            />

            {/* SWITCH HABILITAR / DESHABILITAR */}
            <div className="flex flex-col gap-1 justify-end">
                <label className="text-sm font-medium text-white">
                    Estado del material
                </label>
                <div className="flex items-center gap-3 h-12">
                    <Switch checked={isEnabled} onChange={setIsEnabled} />
                    <span className="text-sm font-semibold text-white">
                        {isEnabled ? "Habilitado" : "Deshabilitado"}
                    </span>
                </div>
            </div>

            {/* BOTONES */}
            <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
                <Button variant="secondary" size="sm" onClick={onBack}>
                    Atrás
                </Button>
                <Button variant="primary" size="md" onClick={handleNext}>
                    Siguiente
                </Button>
            </div>

        </div>
    );
}
