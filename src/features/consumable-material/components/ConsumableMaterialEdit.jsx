import { getStateTypes } from "@/features/consumable-material/services/selectService.js"
import { Input, Button, Select, DatePicker } from "@/shared";
import { useState, useEffect } from "react";
import { consumableMaterialSchema } from "../schemas/consumableMaterialSchema";

export default function UseEditConsumableMaterial() {

    const [state, setStateTypes] = useState([]);

        useEffect(() => {
            getStateTypes().then(setStateTypes);
        }, [])

    const [formData, setFormData] = useState({
        consumableMaterialElementName: "",
        consumableMaterialBrand: "",
        consumableMaterialSerial: "",
        consumableMaterialImage: "",
        consumableMaterialPurchaseDate: "",
        consumableMaterialAmount: "",
        consumableMaterialUnitValue: "",
        consumableMaterialTotalValue: "",
        consumableMaterialTechnicalSheet: "",
        consumableMaterialDescription: "",
        consumableMaterialAccountHolder: "",
        consumableMaterialLocation: "",
        consumableMaterialState: "",
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
        const result = consumableMaterialSchema.safeParse(formData);
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
                Editar Material Consumo
            </h1>

            <h2 className="text-text-primary text-1xl mb-6">
                Edite la información correspondiente
            </h2>

            <form
                className="grid grid-cols-1 items-center gap-6"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">

                    {/* Pagina 1 */}
                    <Input
                        label="Imagen"
                        name="consumableMaterialImage"
                        placeholder="Arrastra o carga tu imagen aquí"
                        value={formData.consumableMaterialImage}
                        onChange={handleChange}
                        error={errors.consumableMaterialImage}
                    />
                    <Input
                        label="Ficha Técnica"
                        name="consumableMaterialTechnicalSheet"
                        placeholder="Arrastra o carga tu ficha técnica aquí"
                        value={formData.consumableMaterialTechnicalSheet}
                        onChange={handleChange}
                        error={errors.consumableMaterialTechnicalSheet}
                    />
                    <Input
                        label="Escribe el serial"
                        name="consumableMaterialSerial"
                        placeholder="Serial"
                        value={formData.consumableMaterialSerial}
                        onChange={handleChange}
                        error={errors.consumableMaterialSerial}
                    />
                    <Input
                        label="Nombre Elemento"
                        name="consumableMaterialElementName"
                        placeholder="Escribe el nombre del elemento"
                        value={formData.consumableMaterialElementName}
                        onChange={handleChange}
                        error={errors.consumableMaterialElementName}
                    />
                    <Input
                        label="Marca"
                        name="consumableMaterialBrand"
                        placeholder="Escribe y busca la marca"
                        value={formData.consumableMaterialBrand}
                        onChange={handleChange}
                        error={errors.consumableMaterialBrand}
                    />
                    {/* Pagina 2 */}
                    <Input
                        label="Cuentadante"
                        name="consumableMaterialAccountHolder"
                        placeholder="Escribe el nombre del cuentadante"
                        value={formData.consumableMaterialAccountHolder}
                        onChange={handleChange}
                        error={errors.consumableMaterialAccountHolder}
                    />
                    <Input
                        label="Cantidad"
                        name="consumableMaterialAmount"
                        placeholder="Escribe la cantidad del material"
                        value={formData.consumableMaterialAmount}
                        onChange={handleChange}
                        error={errors.consumableMaterialAmount}
                    />
                    <Input
                        label="Valor unitario"
                        name="consumableMaterialUnitValue"
                        placeholder="Escribe el valor unitario del material"
                        value={formData.consumableMaterialUnitValue}
                        onChange={handleChange}
                        error={errors.consumableMaterialUnitValue}
                    />
                    <Input
                        label="Valor total"
                        name="consumableMaterialTotalValue"
                        placeholder="Escribe el valor total del material"
                        value={formData.consumableMaterialTotalValue}
                        onChange={handleChange}
                        error={errors.consumableMaterialTotalValue}
                    />
                    {/* Pagina 3*/}
                    <Select
                        label="Estado"
                        name="consumableMaterialState"
                        placeholder="Seleccione el estado"
                        value={formData.consumableMaterialState}
                        options={state}
                        onChange={handleChange}
                        error={errors.consumableMaterialState}
                    />
                    <Input
                        label="Descripción"
                        name="consumableMaterialDescription"
                        placeholder="Escribe la descripción aquí"
                        value={formData.consumableMaterialDescription}
                        onChange={handleChange}
                        error={errors.consumableMaterialDescription}
                    />
                    <DatePicker
                        label="Fecha de compra"
                        name="consumableMaterialPurchaseDate"
                        placeholder="Fecha de compra"
                        value={formData.consumableMaterialPurchaseDate}
                        onChange={handleChange}
                        error={errors.consumableMaterialPurchaseDate}
                    />
                    <Input
                        label="Ubicación"
                        name="consumableMaterialLocation"
                        placeholder="Escribre la ubicación aquí"
                        value={formData.consumableMaterialLocation}
                        onChange={handleChange}
                        error={errors.consumableMaterialLocation}
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