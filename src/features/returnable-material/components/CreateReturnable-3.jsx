import { getDimensionsTypes } from "@/features/returnable-material/services/selectService.js"
import { Input, Button, Select } from "@/shared";
import { useState, useEffect } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    const [dimensions, setDimensionsTypes] = useState([]);

    useEffect(() => {
        getDimensionsTypes().then(setDimensionsTypes);
    }, [])

    const [ formData, setFormData ] = useState({
        materialState: "",
        materialTechnicalSheet: "",
        materialDescription: "",
        materialLocation: "",
        materialDimensions: "",
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
                        name="materialState"
                        placeholder="Estado"
                        value={formData.materialState}
                        onChange={handleChange}
                        error={errors.materialState}
                    />
                    <Input
                        name="materialTechnicalSheet"
                        placeholder="Ficha tecnica"
                        value={formData.materialTechnicalSheet}
                        onChange={handleChange}
                        error={errors.materialTechnicalSheet}
                    />
                    <Input
                        name="materialDescription"
                        placeholder="Descripcion"
                        value={formData.materialDescription}
                        onChange={handleChange}
                        error={errors.materialDescription}
                    />
                    <Input
                        name="materialLocation"
                        placeholder="Ubicacion"
                        value={formData.materialLocation}
                        onChange={handleChange}
                        error={errors.materialLocation}
                    />
                    <Select
                        name="materialDimensions"
                        placeholder="Dimensiones"
                        value={formData.materialDimensions}
                        options={dimensions}
                        onChange={handleChange}
                        error={errors.materialDimensions}
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