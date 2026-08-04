import { useState, useEffect } from "react";
import { Input, Button, Select, DatePicker, Textarea, FileInput, alertSuccess, alertWarning, alertError  } from "@/shared";
import { FileText } from "lucide-react";
import { getStateTypes } from "../services/selectService";
import { consumableStep3Schema } from "../schemas/consumableStep3Schema";

const MAX_SHEET_MB = 3;

function sheetFileName(url) {
  if (!url) return null;
  return url.split("/").pop();
}

export default function EditConsumableMaterial3({ formData, onSave, onBack }) {
  const [states, setStates] = useState([]);
  const currentSheetUrl = formData.materialTechnicalSheetUrl || null;
  const [sheetRemoved, setSheetRemoved] = useState(false);

  const [fields, setFields] = useState({
    materialState:          formData.materialState          || "",
    materialDescription:    formData.materialDescription    || "",
    MaterialPurchaseDate:   formData.MaterialPurchaseDate   || "",
    materialLocation:       formData.materialLocation       || "",
    materialTechnicalSheet: formData.materialTechnicalSheet || [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getStateTypes().then(setStates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSheetChange = (files) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, materialTechnicalSheet: "Solo se permiten archivos PDF" }));
        return;
      }
      if (file.size > MAX_SHEET_MB * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, materialTechnicalSheet: `El archivo supera los ${MAX_SHEET_MB}MB` }));
        return;
      }
    }
    setFields((prev) => ({ ...prev, materialTechnicalSheet: files }));
    setErrors((prev) => ({ ...prev, materialTechnicalSheet: "" }));
  };

  const handleSave = () => {
    const { MaterialPurchaseDate, ...rest } = fields;
    const result = consumableStep3Schema.safeParse({
      ...rest,
      purchaseDate: MaterialPurchaseDate,
    });

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] === "purchaseDate" ? "MaterialPurchaseDate" : issue.path[0];
        if (field && !newErrors[field]) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de guardar.");
      return;
    }

    try {
      onSave({ ...fields, sheetRemoved });
    } catch (err) {
      console.error("Error al guardar material:", err);
      alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[600px] mx-auto">

      <Select labelVariant="light"
        label="Estado"
        name="materialState"
        value={fields.materialState}
        options={states}
        onChange={handleChange}
        error={errors.materialState}
        required
      />

      <Textarea
        label="Descripción"
        name="materialDescription"
        placeholder="Escribe la descripción aquí"
        value={fields.materialDescription}
        onChange={handleChange}
        error={errors.materialDescription}
      />

      <DatePicker labelVariant="light"
        label="Fecha de compra"
        name="MaterialPurchaseDate"
        value={fields.MaterialPurchaseDate}
        onChange={handleChange}
        error={errors.MaterialPurchaseDate}
        maxDate={new Date()}
        required
      />

      <Input labelVariant="light"
        label="Ubicación"
        name="materialLocation"
        placeholder="Escribe la ubicación del material"
        value={fields.materialLocation}
        onChange={handleChange}
        error={errors.materialLocation}
        required
      />

      {/* Ficha técnica — opcional, solo PDF, máx 3 MB */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">
          Ficha técnica
          <span className="text-xs text-gray-400 ml-1">(Opcional · Solo PDF · máx 3MB)</span>
        </label>

        {fields.materialTechnicalSheet?.length > 0 ? (
          /* Caso 1: usuario seleccionó un nuevo archivo */
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white/80">
            <FileText size={14} className="shrink-0 text-cyan-400" />
            <span className="truncate flex-1">{fields.materialTechnicalSheet[0].name}</span>
            <button
              type="button"
              onClick={() => setFields((prev) => ({ ...prev, materialTechnicalSheet: [] }))}
              className="shrink-0 text-red-400 hover:text-red-300 font-semibold px-1"
            >
              Eliminar
            </button>
          </div>
        ) : currentSheetUrl && !sheetRemoved ? (
          /* Caso 2: hay archivo en servidor → mostrar nombre + opción de eliminar */
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white/80">
            <FileText size={14} className="shrink-0 text-cyan-400" />
            <span className="truncate flex-1">doc - <strong>{sheetFileName(currentSheetUrl)}</strong></span>
            <button
              type="button"
              onClick={() => setSheetRemoved(true)}
              className="shrink-0 text-red-400 hover:text-red-300 font-semibold px-1"
            >
              Eliminar
            </button>
          </div>
        ) : (
          /* Caso 3: sin archivo → mostrar selector */
          <FileInput
            value={fields.materialTechnicalSheet}
            onChange={handleSheetChange}
            accept="application/pdf"
            multiple={false}
          />
        )}

        {errors.materialTechnicalSheet && (
          <span className="text-red-500 text-xs">{errors.materialTechnicalSheet}</span>
        )}
      </div>

      <div className="col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-2">
        <Button variant="secondary" size="sm" onClick={onBack}>
          Atrás
        </Button>

        <Button variant="primary" size="md" onClick={handleSave}>
          Guardar material de consumo
        </Button>
      </div>

    </div>
  );
}
