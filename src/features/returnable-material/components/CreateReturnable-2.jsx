import { Input, Button, } from "@/shared";
import { useState, } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    // Estado del formulario con los campos de informacion economica del material
    const [ formData, setFormData ] = useState({
        materialStoryTeller: "",
        materialAmount: "",
        materialUnitValue: "",
        materialTotalValue: "",
    });

    // Estado para los errores de validacion
    const [errors, setErrors] = useState({});

    // Actualiza el campo correspondiente en formData cada vez que el usuario escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }))
    }

    // Valida el formulario con Zod al hacer submit
    // Si hay errores los mapea por campo y los guarda en el estado errors
    // Si es exitoso limpia los errores y procesa los datos
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

                    {/* Informacion economica y de responsabilidad del material
                        materialStoryTeller: persona responsable del material
                        materialAmount: cantidad de unidades del material
                        materialUnitValue: valor por unidad
                        materialTotalValue: resultado de cantidad por valor unitario */}
                    <Input
                        label="Cuentadante"
                        name="materialStoryTeller"
                        placeholder="Ingrese el cuentadante"
                        value={formData.materialStoryTeller}
                        onChange={handleChange}
                        error={errors.materialStoryTeller}
                    />
                    <Input
                        label="Cantidad"
                        name="materialAmount"
                        placeholder="Ingrese la cantidad"
                        value={formData.materialAmount}
                        onChange={handleChange}
                        error={errors.materialAmount}
                    />
                    <Input
                        label="Valor unitario"
                        name="materialUnitValue"
                        placeholder="Ingrese el valor unitario"
                        value={formData.materialUnitValue}
                        onChange={handleChange}
                        error={errors.materialUnitValue}
                    />
                    <Input
                        label="Valor total"
                        name="materialTotalValue"
                        placeholder="Ingrese el valor total"
                        value={formData.materialTotalValue}
                        onChange={handleChange}
                        error={errors.materialTotalValue}
                    />

                    {/* Actions */}
                    <div className="flex items-end justify-end gap-6">
                        <Button variant="secondary" size="sm">Cancelar</Button>
                        <Button variant="primary" size="md">Siguiente</Button>
                    </div>

                </div>
            </form>
        </div>
    );
}