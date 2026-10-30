
import { useState, useEffect } from "react";
import { Input, Button, MultiUserSearchField, InventorySelectField, CategorySelectField } from "@/shared";
import { returnableStep1Schema } from "../schemas/returnableStep1Schema";
import { getNextReturnableId } from "../services/returnableMaterialService";
import { getCategories } from "@/features/categories/services/categoryService";

export default function CreateReturnable1({ formData, onNext, onCancel }) {
  const [prefixMap, setPrefixMap] = useState({});

  const [fields, setFields] = useState({
    returnableMaterialId: formData.returnableMaterialId || "",
    materialPlate:        formData.materialPlate        || "",
    materialCategory:     formData.materialCategory     || "",
    materialElementName:  formData.materialElementName  || "",
    materialStoryTeller:  formData.materialStoryTeller  || [],
    materialInventory:    formData.materialInventory    || "",
  });
  const [errors, setErrors] = useState({});

  // Cargar prefixMap para generar el ID automático según la categoría
  useEffect(() => {
    getCategories()
      .then((cats) => {
        const map = {};
        cats.filter((c) => c.enabled).forEach((c) => { map[c.name] = c.prefix || ""; });
        setPrefixMap(map);
      })
      .catch(() => {});
  }, []);

  // Consultar el backend por el siguiente ID disponible cuando cambia la categoría
  useEffect(() => {
    if (!fields.materialCategory) return;
    const prefix = prefixMap[fields.materialCategory];
    if (!prefix) return;
    getNextReturnableId(prefix)
      .then((nextId) => setFields((prev) => ({ ...prev, returnableMaterialId: nextId })))
      .catch(() => {});
  }, [fields.materialCategory, prefixMap]);

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
    <div className="grid grid-cols-1 @[500px]:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
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
      <CategorySelectField
        labelVariant="light"
        label="Tipo de material"
        name="materialCategory"
        value={fields.materialCategory}
        onChange={handleChange}
        error={errors.materialCategory}
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
      <InventorySelectField
        labelVariant="light"
        value={fields.materialInventory}
        onChange={handleChange}
        name="materialInventory"
        error={errors.materialInventory}
      />
      <div className="@[500px]:col-span-2 flex flex-col sm:flex-row justify-end gap-4">
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary"   size="md" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
