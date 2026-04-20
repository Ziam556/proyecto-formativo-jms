import { getCategoriesTypes } from "@/features/returnable-material/services/selectService.js"
import { Input, Button, Select } from "@/shared";
import { useState, useEffect } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    // Estado para las opciones del select de dimensiones
    // Se carga desde un archivo JSON a traves del servicio getDimensionsTypes
    const [categories, setCategoriesTypes] = useState([]);

    useEffect(() => {
        getCategoriesTypes().then(setCategoriesTypes);
    }, [])

    // Estado del formulario con los campos de descripcion y ubicacion del material
    const [ formData, setFormData ] = useState({
        materialId: "",
        materialPlate: "",
        materialCategory: "",
        materialElementName: "",
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
                    
                    <Input
                        label="Placa SENA"
                        name="materialPlate"
                        placeholder="Ingrese la placa SENA"
                        value={formData.materialPlate}
                        onChange={handleChange}
                        error={errors.materialPlate}
                    />
                    <Select
                        label="Categoría"
                        name="materialCategory"
                        placeholder="Ingrese la categoria"
                        value={formData.materialCategory}
                        options={categories}
                        onChange={handleChange}
                        error={errors.materialCategory}
                    />
                    <Input
                        label="Nombre del elemento"
                        name="materialElementName"
                        placeholder="Escriba el nombre del elemento"
                        value={formData.materialElementName}
                        onChange={handleChange}
                        error={errors.materialElementName}
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