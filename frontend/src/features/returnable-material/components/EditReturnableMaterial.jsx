import { Input, Button, Select, DatePicker } from "@/shared";
import { useState, useEffect } from "react";
import { materialSchema } from "../schemas/materialSchema";
import { getDimensionsTypes, getCategoriesTypes, getStateTypes } from "@/features/returnable-material/services/selectService.js";

export default function UseEditReturnableMaterial() {

    const [dimensions, setDimensionsTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [state, setStateTypes] = useState([]);

    useEffect(() => {
        getDimensionsTypes().then(setDimensionsTypes);
        getCategoriesTypes().then(setCategories);
        getStateTypes().then(setStateTypes);
    }, [])


    const [formData, setFormData] = useState({
        returnableMaterialBrand: "",
        returnableMaterialPlate: "",
        returnableMaterialModel: "",
        materialState: "",
        returnableMaterialAccountHolder: "",
        returnableMaterialState: "",
        returnableMaterialAmount: "",
        returnableMaterialTechnicalSheet: "",
        returnableMaterialElementName: "",
        returnableMaterialSerial: "",
        returnableMaterialCategory: "",
        returnableMaterialUnitValue: "",
        returnableMaterialTotalValue: "",
        returnableMaterialDescription: "",
        returnableMaterialLocation: "",
        returnableMaterialDimensions: "",
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
        console.log("Datos válidos", result.data)
    }

    return (
        <div>
            <h1 className="text-text-primary text-2xl mb-6">
                Editar Material Devolutivo
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
                        label="Placa SENA"
                        name="returnableMaterialPlate"
                        placeholder="Escribe la placa SENA"
                        value={formData.returnableMaterialPlate}
                        onChange={handleChange}
                        error={errors.returnableMaterialPlate}
                    />
                    <Input
                        label="Nombre Elemento"
                        name="returnableMaterialElementName"
                        placeholder="Escribe el nombre del elemento"
                        value={formData.returnableMaterialElementName}
                        onChange={handleChange}
                        error={errors.returnableMaterialElementName}
                    />
                    <Select
                        name="returnableMaterialCategory"
                        placeholder="Categoría"
                        value={formData.returnableMaterialCategory}
                        options={categories}
                        onChange={handleChange}
                        error={errors.returnableMaterialCategory}
                    />

                    {/* Pagina 2*/}
                    <Input
                        label="Marca"
                        name="returnableMaterialBrand"
                        placeholder="Escribe y busca la marca"
                        value={formData.returnableMaterialBrand}
                        onChange={handleChange}
                        error={errors.returnableMaterialBrand}
                    />
                    <Input
                        label="Modelo"
                        name="returnableMaterialModel"
                        placeholder="Escribe el modelo"
                        value={formData.returnableMaterialModel}
                        onChange={handleChange}
                        error={errors.returnableMaterialModel}
                    />
                    <Input
                        label="Serial"
                        name="returnableMaterialSerial"
                        placeholder="Escribe el serial"
                        value={formData.returnableMaterialSerial}
                        onChange={handleChange}
                        error={errors.returnableMaterialSerial}
                    />
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
                        placeholder="Fecha de compra"
                        value={formData.MaterialPurchaseDate}
                        onChange={handleChange}
                        error={errors.MaterialPurchaseDate}
                    />
                    {/* Pagina 3*/}
                    <Input
                        name="returnableMaterialAccountHolder"
                        placeholder="Cuentadante"
                        value={formData.returnableMaterialAccountHolder}
                        onChange={handleChange}
                        error={errors.returnableMaterialAccountHolder}
                    />
                    <Input
                        name="returnableMaterialAmount"
                        placeholder="Cantidad"
                        value={formData.returnableMaterialAmount}
                        onChange={handleChange}
                        error={errors.returnableMaterialAmount}
                    />
                    <Input
                        name="returnableMaterialUnitValue"
                        placeholder="Valor Unitario"
                        value={formData.returnableMaterialUnitValue}
                        onChange={handleChange}
                        error={errors.returnableMaterialUnitValue}
                    />
                    <Input
                        name="returnableMaterialTotalValue"
                        placeholder="Valor Total"
                        value={formData.returnableMaterialTotalValue}
                        onChange={handleChange}
                        error={errors.returnableMaterialTotalValue}
                    />
                    {/* Pagina 4*/}
                    <Select
                        label="Estado"
                        name="consumableMaterialState"
                        placeholder="Seleccione el estado"
                        value={formData.materialState}
                        options={state}
                        onChange={handleChange}
                        error={errors.materialState}
                    />
                    <Input
                        name="returnableMaterialTechnicalSheet"
                        placeholder="Ficha Técnica"
                        value={formData.returnableMaterialTechnicalSheet}
                        onChange={handleChange}
                        error={errors.returnableMaterialTechnicalSheet}
                    />
                    <Input
                        name="returnableMaterialDescription"
                        placeholder="Descripción"
                        value={formData.returnableMaterialDescription}
                        onChange={handleChange}
                        error={errors.returnableMaterialDescription}
                    />
                    <Input
                        name="returnableMaterialLocation"
                        placeholder="Ubicación"
                        value={formData.returnableMaterialLocation}
                        onChange={handleChange}
                        error={errors.returnableMaterialLocation}
                    />
                    <Select
                        name="returnableMaterialDimensions"
                        placeholder="Dimensiones"
                        options={dimensions}
                        value={formData.returnableMaterialDimensions}
                        onChange={handleChange}
                        error={errors.returnableMaterialDimensions}
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