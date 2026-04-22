import { Input, Button, DatePicker } from "@/shared";
import { useState } from "react";
import { materialSchema } from "../../returnable-material/schemas/materialSchema";

export default function UserRegisterForm() {

    // Estado del formulario con los campos de identificacion del material
    const [ formData, setFormData ] = useState({
        materialBrand: "",
        materialModel: "",
        materialSerial: "",
        materialImage: "",
        MaterialPurchaseDate: "",
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

                    {/* Identificacion del material */}
                    <Input
                        label="Marca"
                        name="materialBrand"
                        placeholder="Escribe y busca la marca"
                        value={formData.materialBrand}
                        onChange={handleChange}
                        error={errors.materialBrand}
                    />
                    <Input
                        label="Modelo"
                        name="materialModel"
                        placeholder="Escribe el modelo"
                        value={formData.materialModel}
                        onChange={handleChange}
                        error={errors.materialModel}
                    />
                    <Input
                        label="Serial"
                        name="materialSerial"
                        placeholder="Escribe el serial"
                        value={formData.materialSerial}
                        onChange={handleChange}
                        error={errors.materialSerial}
                    />
                    {/* Campo para subir o referenciar la imagen del material */}
                    <Input
                        label="Imagen"
                        name="materialImage"
                        placeholder="Ingrese la imagen"
                        value={formData.materialImage}
                        onChange={handleChange}
                        error={errors.materialImage}
                    />

                    <DatePicker
                        label="Fecha de compra"
                        name="consumableMaterialPurchaseDate"
                        placeholder="Selecciona la fecha de compra"
                        value={formData.MaterialPurchaseDate}
                        onChange={handleChange}
                        error={errors.MaterialPurchaseDate}
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