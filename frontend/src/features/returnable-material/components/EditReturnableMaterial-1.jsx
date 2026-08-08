import { useState, useEffect } from "react";
import { Input, Button, MultiUserSearchField, Select } from "@/shared";
import { returnableStep1Schema } from "../schemas/returnableStep1Schema";
import { getCategories } from "@/features/categories/services/categoryService";
import { getInventories } from "@/features/inventories/services/inventoryService";

export default function EditReturnableMaterial1({ formData = {}, onNext, onCancel }) {
  const [categoryOptions, setCategoryOptions]   = useState([]);
  const [inventoryOptions, setInventoryOptions] = useState([]);

  const [fields, setFields] = useState({
    returnableMaterialId:    formData.returnableMaterialId    || "",
    materialPlate:           formData.materialPlate           || "",
    materialCategory:        formData.materialCategory        || "",
    materialElementName:     formData.materialElementName     || "",
    materialStoryTeller:     formData.materialStoryTeller     || [],
    materialInventory:       formData.materialInventory       || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCategories()
      .then((cats) =>
        setCategoryOptions(
          cats.filter((c) => c.enabled).map((c) => ({ id: c.name, label: c.name }))
        )
      )
      .catch(() => {});
    getInventories()
      .then((invs) =>
        setInventoryOptions(
          invs.filter((i) => i.enabled).map((i) => ({ id: i.name, label: i.name }))
        )
      )
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const result = returnableStep1Schema.safeParse(fields);
    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && !newErrors[field]) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    onNext(fields);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
      <Input labelVariant="light"
        label="Número de serie (SN) (opcional)"
        name="returnableMaterialId"
        placeholder="Ej: HER-001"
        value={fields.returnableMaterialId}
        onChange={handleChange}
        error={errors.returnableMaterialId}
      />
      <Input labelVariant="light"
        label="Placa SENA"
        name="materialPlate"
        placeholder="Escribe la placa SENA"
        value={fields.materialPlate}
        onChange={handleChange}
        error={errors.materialPlate}
        required
      />
      <Input labelVariant="light"
        label="Nombre del elemento"
        name="materialElementName"
        placeholder="Escribe el nombre del elemento"
        value={fields.materialElementName}
        onChange={handleChange}
        error={errors.materialElementName}
        required
      />
      <Select labelVariant="light"
        label="Categoría"
        name="materialCategory"
        value={fields.materialCategory}
        options={categoryOptions}
        onChange={handleChange}
        error={errors.materialCategory}
        placeholder="Selecciona una categoría"
        required
      />
      <MultiUserSearchField
        label="Cuentadante(s)"
        value={fields.materialStoryTeller}
        onChange={(arr) => {
          setFields((prev) => ({ ...prev, materialStoryTeller: arr }));
          setErrors((prev) => ({ ...prev, materialStoryTeller: "" }));
        }}
        error={errors.materialStoryTeller}
        required
      />
      <Select labelVariant="light"
        label="Nombre de inventario (opcional)"
        name="materialInventory"
        value={fields.materialInventory}
        options={inventoryOptions}
        onChange={handleChange}
        error={errors.materialInventory}
        placeholder="Selecciona un inventario"
      />
      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-4">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
