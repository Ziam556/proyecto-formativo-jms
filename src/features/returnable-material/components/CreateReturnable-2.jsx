import { Input, Button, } from "@/shared";
import { useState, } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    const [ formData, setFormData ] = useState({
        materialStoryTeller: "",
        materialAmount: "",
        materialUnitValue: "",
        materialTotalValue: "",
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

        const result = materialSchema.safeParse(formData);
        
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
        console.log("Usuario invalido", result.data)
    }

    return (
        <div>
            <h1 className="text-text-primary text-2xl mb-6">
                Registro de material devolutivo 
            </h1>

            <form
                className="grid grid-cols-1 items-center gap-6"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">

                    <Input
                        name="materialStoryTeller"
                        placeholder="Cuentadante"
                        value={formData.materialStoryTeller}
                        onChange={handleChange}
                        error={errors.materialStoryTeller}
                    />
                    <Input
                        name="materialAmount"
                        placeholder="Cantidad"
                        value={formData.materialAmount}
                        onChange={handleChange}
                        error={errors.materialAmount}
                    />
                    <Input
                        name="materialUnitValue"
                        placeholder="Valor unitario"
                        value={formData.materialUnitValue}
                        onChange={handleChange}
                        error={errors.materialUnitValue}
                    />
                    <Input
                        name="materialTotalValue"
                        placeholder="Valor total"
                        value={formData.materialTotalValue}
                        onChange={handleChange}
                        error={errors.materialTotalValue}
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
                            Siguiente
                        </Button>
                    </div>

                </div>
            </form>
        </div>
    );
}