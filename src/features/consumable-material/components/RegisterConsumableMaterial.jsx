import { Input, Button } from "@/shared";
import { useState } from "react";
import { consumableMaterialSchema } from "../schemas/consumableMaterialSchema";

export default function UseRegisterMaterialConsumption() {

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
                Registro Material Consumo
            </h1>

            <h2 className="text-text-primary text-1xl mb-6">
                Ingrese la información correspondiente
            </h2>

            <form
                className="grid grid-cols-1 items-center gap-6"
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-6 my-0 mx-auto">

                    <Input
                        name="consumableMaterialElementName"
                        placeholder="Nombre Elemento"
                        value={formData.consumableMaterialElementName}
                        onChange={handleChange}
                        error={errors.consumableMaterialElementName}
                    />
                    <Input
                        name="consumableMaterialBrand"
                        placeholder="Marca"
                        value={formData.consumableMaterialBrand}
                        onChange={handleChange}
                        error={errors.consumableMaterialBrand}
                    />
                    <Input
                        name="consumableMaterialSerial"
                        placeholder="Serial"
                        value={formData.consumableMaterialSerial}
                        onChange={handleChange}
                        error={errors.consumableMaterialSerial}
                    />
                    <Input
                        name="consumableMaterialImage"
                        placeholder="Imagen"
                        value={formData.consumableMaterialImage}
                        onChange={handleChange}
                        error={errors.consumableMaterialImage}
                    />
                    <Input
                        name="consumableMaterialPurchaseDate"
                        placeholder="Fecha Compra"
                        value={formData.consumableMaterialPurchaseDate}
                        onChange={handleChange}
                        error={errors.consumableMaterialPurchaseDate}
                    />
                    <Input
                        name="consumableMaterialAmount"
                        placeholder="Cantidad"
                        value={formData.consumableMaterialAmount}
                        onChange={handleChange}
                        error={errors.consumableMaterialAmount}
                    />
                    <Input
                        name="consumableMaterialUnitValue"
                        placeholder="Valor Unitario"
                        value={formData.consumableMaterialUnitValue}
                        onChange={handleChange}
                        error={errors.consumableMaterialUnitValue}
                    />
                    <Input
                        name="consumableMaterialTotalValue"
                        placeholder="Valor Total"
                        value={formData.consumableMaterialTotalValue}
                        onChange={handleChange}
                        error={errors.consumableMaterialTotalValue}
                    />
                    <Input
                        name="consumableMaterialTechnicalSheet"
                        placeholder="Ficha Técnica"
                        value={formData.consumableMaterialTechnicalSheet}
                        onChange={handleChange}
                        error={errors.consumableMaterialTechnicalSheet}
                    />
                    <Input
                        name="consumableMaterialDescription"
                        placeholder="Descripción"
                        value={formData.consumableMaterialDescription}
                        onChange={handleChange}
                        error={errors.consumableMaterialDescription}
                    />
                    <Input
                        name="consumableMaterialAccountHolder"
                        placeholder="Cuentadante"
                        value={formData.consumableMaterialAccountHolder}
                        onChange={handleChange}
                        error={errors.consumableMaterialAccountHolder}
                    />
                    <Input
                        name="consumableMaterialLocation"
                        placeholder="Ubicación"
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