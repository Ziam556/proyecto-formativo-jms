import { getDimensionsTypes } from "@/features/returnable-material/services/selectService.js"
import { Input, Button, Select } from "@/shared";
import { useState, useEffect } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    // Estado para las opciones del select de dimensiones
    // Se carga desde un archivo JSON a traves del servicio getDimensionsTypes
    const [dimensions, setDimensionsTypes] = useState([]);

    useEffect(() => {
        getDimensionsTypes().then(setDimensionsTypes);
    }, [])

    // Estado del formulario con los campos de descripcion y ubicacion del material
    const [ formData, setFormData ] = useState({
        materialState: "",
        materialTechnicalSheet: "",
        materialDescription: "",
        materialLocation: "",
        materialDimensions: "",
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

                    {/* Descripcion y ubicacion fisica del material */}
                    <Input
                        label="Estado"
                        name="materialState"
                        placeholder="Ingrese el estado"
                        value={formData.materialState}
                        onChange={handleChange}
                        error={errors.materialState}
                    />
                    <Input
                        label="Ficha técnica"
                        name="materialTechnicalSheet"
                        placeholder="Ingrese la ficha técnica"
                        value={formData.materialTechnicalSheet}
                        onChange={handleChange}
                        error={errors.materialTechnicalSheet}
                    />
                    <Input
                        label="Descripción"
                        name="materialDescription"
                        placeholder="Ingrese la descripción"
                        value={formData.materialDescription}
                        onChange={handleChange}
                        error={errors.materialDescription}
                    />
                    <Input
                        label="Ubicación"
                        name="materialLocation"
                        placeholder="Ingrese la ubicación"
                        value={formData.materialLocation}
                        onChange={handleChange}
                        error={errors.materialLocation}
                    />
                    {/* Las dimensiones se cargan dinamicamente desde el JSON
                        y se muestran como opciones en el select */}
                    <Select
                        label="Dimensiones"
                        name="materialDimensions"
                        placeholder="Seleccione las dimensiones"
                        value={formData.materialDimensions}
                        options={dimensions}
                        onChange={handleChange}
                        error={errors.materialDimensions}
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