import { getMaterialsTypes } from "@/features/loans/services/selectService.js"
import { Input, Button, Select } from "@/shared";
import { useState, useEffect } from "react";
import { loanSchema } from "../schemas/loanSchema.js";

export default function UseEditLoan() {

    const [materialsTypes, setMaterialsTypes] = useState([]);

    useEffect(() => {
        getMaterialsTypes().then(setMaterialsTypes);
    }, [])

    const [formData, setFormData] = useState({
        loanMaterialName: "",
        loanGroup: "",
        loanStartDate: "",
        loanEstimatedDate: "",
        loanMaterials: "",
        loanRequestingUser: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const result = loanSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0]
                fieldErrors[field] = issue.message
            });
            setErrors(fieldErrors)
            return;
        }
        setErrors({});
        console.log("Datos válidos", result.data)
    }

    return (
        <div>
            <h1 className="col-span-2 text-text-primary text-2xl mb-6">
                Editar Prestamo
            </h1>

            <h2 className="text-text-primary text-1xl mb-6">
                Edite la información correspondiente
            </h2>

            <form
                className="grid grid-cols-1 items-center gap-6"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">

                    <Input
                        name="loanMaterialName"
                        placeholder="Placa Sena/Nombre Material"
                        value={formData.loanMaterialName}
                        onChange={handleChange}
                        error={errors.loanMaterialName}
                    />
                    <Input
                        name="loanGroup"
                        placeholder="Grupo"
                        value={formData.loanGroup}
                        onChange={handleChange}
                        error={errors.loanGroup}
                    />
                    <Input
                        name="loanStartDate"
                        placeholder="Fecha Salida"
                        value={formData.loanStartDate}
                        onChange={handleChange}
                        error={errors.loanStartDate}
                    />
                    <Input
                        name="loanEstimatedDate"
                        placeholder="Fecha Estimada"
                        value={formData.loanEstimatedDate}
                        onChange={handleChange}
                        error={errors.loanEstimatedDate}
                    />
                    <Select
                        name="loanMaterials"
                        placeholder="Materiales"
                        value={formData.loanMaterials}
                        options={materialsTypes}
                        onChange={handleChange}
                        error={errors.loanMaterials}
                    />
                    <Input
                        name="loanRequestingUser"
                        placeholder="Usuario Solicitante"
                        value={formData.loanRequestingUser}
                        onChange={handleChange}
                        error={errors.loanRequestingUser}
                    />

                    {/* Actions */}
                    <div className="flex items-end justify-end gap-6">
                        <Button
                            variant="secondary"
                            size="sm"
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="primary"
                            size="md"
                        >
                            Guardar Prestamo
                        </Button>
                    </div>

                </div>
            </form>
        </div>
    );
}