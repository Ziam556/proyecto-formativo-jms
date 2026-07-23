import { useState, useEffect } from "react";
import { BackButton, alertSuccess, alertError, SearchField, Switch } from "@/shared";
import { useNavigate } from "react-router-dom";
import {
    getReturnableMaterials,
    updateReturnableMaterial,
} from "../services/returnableMaterialService";
import EditReturnableMaterial1 from "../components/EditReturnableMaterial-1";
import EditReturnableMaterial2 from "../components/EditReturnableMaterial-2";
import EditReturnableMaterial3 from "../components/EditReturnableMaterial-3";
import EditReturnableMaterial4 from "../components/EditReturnableMaterial-4";

const steps = [
    "1. ID - Placa SENA - Categoría - Nombre del elemento",
    "2. Marca - Modelo - Serial - Imagen",
    "3. Cuentadante - Cantidad - Valor unitario - Valor total",
    "4. Estado - Ficha técnica - Descripción - Ubicación",
];

// Convierte una fila cruda del backend (snake_case) a los nombres
// que esperan los 4 pasos del wizard de edición.
function toWizardFields(row) {
    return {
        returnableMaterialId:    row.returnable_material_id,
        materialPlate:           row.material_plate            || "",
        materialCategory:        row.material_category         || "",
        materialElementName:     row.material_element_name     || "",
        materialBrand:           row.material_brand            || "",
        materialModel:           row.material_model            || "",
        materialSerial:          row.material_serial           || "",
        materialImage:           [],
        materialStoryTeller:     row.material_story_teller     || "",
        materialAmount:          row.material_amount           ?? "",
        materialUnitValue:       row.material_unit_value       ?? "",
        materialTotalValue:      row.material_total_value      ?? "",
        isEnabled:               row.enabled                   ?? true,
        materialState:           row.material_state            || "",
        materialTechnicalSheet:  [],
        materialDescription:     row.material_description      || "",
        materialLocation:        row.material_location         || "",
        materialWidth:           row.material_width            || "",
        materialLength:          row.material_length           || "",
        materialDepth:           row.material_depth            || "",
    };
}

export default function EditReturnableMaterialPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData]       = useState({});
    const [isEnabled, setIsEnabled]     = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Datos del backend (filas crudas snake_case, igual que consumable)
    const [materials, setMaterials]   = useState([]);
    const [loadError, setLoadError]   = useState(null);

    const loadMaterials = () => {
        getReturnableMaterials()
            .then(setMaterials)
            .catch((err) => setLoadError(err.message));
    };

    useEffect(() => { loadMaterials(); }, []);

    const filteredMaterials = materials.filter((m) =>
        m.material_element_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.returnable_material_id).includes(searchQuery)
    );

    const handleSelectMaterial = (row) => {
        const fields = toWizardFields(row);
        setFormData(fields);
        setIsEnabled(fields.isEnabled ?? true);
        setCurrentStep(0);
    };

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSave = async (data) => {
        const finalData = { ...formData, ...data };

        if (!finalData.returnableMaterialId) {
            alertError("Falta seleccionar material", "Selecciona un material de la lista antes de guardar.");
            return;
        }

        const payload = {
            materialPlate:        finalData.materialPlate,
            materialCategory:     finalData.materialCategory,
            materialElementName:  finalData.materialElementName,
            materialBrand:        finalData.materialBrand,
            materialModel:        finalData.materialModel,
            materialSerial:       finalData.materialSerial,
            materialStoryTeller:  finalData.materialStoryTeller,
            materialAmount:       finalData.materialAmount,
            materialUnitValue:    finalData.materialUnitValue,
            materialTotalValue:   finalData.materialTotalValue,
            materialState:        finalData.materialState,
            materialDescription:  finalData.materialDescription,
            materialLocation:     finalData.materialLocation,
            materialWidth:        finalData.materialWidth,
            materialLength:       finalData.materialLength,
            materialDepth:        finalData.materialDepth,
            isEnabled,
        };

        const imageFile = Array.isArray(finalData.materialImage)
            ? finalData.materialImage[0]
            : finalData.materialImage;

        const sheetFile = Array.isArray(finalData.materialTechnicalSheet)
            ? finalData.materialTechnicalSheet[0]
            : finalData.materialTechnicalSheet;

        try {
            await updateReturnableMaterial(finalData.returnableMaterialId, payload, imageFile, sheetFile);
            alertSuccess("Material actualizado", "El material devolutivo se actualizó correctamente.");
            loadMaterials();
            setFormData({});
            setCurrentStep(0);
        } catch (err) {
            console.error("Error al guardar material:", err);
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        }
    };

    const matKey = formData.returnableMaterialId ?? "empty";

    const stepComponents = [
        <EditReturnableMaterial1
            key={`s0-${matKey}`}
            formData={formData}
            onNext={handleNext}
            onCancel={() => navigate("/dashboard/returnable-material")}
        />,
        <EditReturnableMaterial2
            key={`s1-${matKey}`}
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <EditReturnableMaterial3
            key={`s2-${matKey}`}
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <EditReturnableMaterial4
            key={`s3-${matKey}`}
            formData={formData}
            onSave={handleSave}
            onBack={handleBack}
        />,
    ];

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border px-3 sm:px-10 py-6 gap-3 items-center justify-center">

            <h1 className="text-white text-[1.2rem] font-semibold m-0">
                Editar material Devolutivo
            </h1>

            <div className="w-full sm:w-[90%] mx-auto">
                <BackButton to="/dashboard/returnable-material" />
            </div>

            {loadError && (
                <p className="text-red-400 text-sm">
                    No se pudieron cargar los materiales: {loadError}
                </p>
            )}

            {/* Switch habilitado / deshabilitado */}
            {formData.returnableMaterialId && (
                <div className="w-full sm:w-[90%] mx-auto flex items-center gap-3 mb-2">
                    <Switch checked={isEnabled} onChange={setIsEnabled} />
                    <span className="text-sm font-semibold text-white">
                        {isEnabled ? "Habilitado" : "Deshabilitado"}
                    </span>
                </div>
            )}

            <div className="w-full sm:w-[90%] min-h-[70vh] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-xl border border-white/20 flex items-center justify-center relative py-8">

                <div className={`flex flex-col sm:flex-row gap-4 px-4 sm:px-0 min-h-[58vh] ${currentStep === 0 ? "w-full sm:w-[95%]" : "w-full sm:w-[84%]"}`}>

                    {/* STEPPER + FORMULARIO */}
                    <div className="flex-1 rounded-xl bg-white/30 flex flex-col sm:flex-row overflow-hidden">

                        {/* STEPPER */}
                        <div className="w-full sm:w-[37%] shrink-0 flex flex-col justify-evenly items-center p-4 sm:p-6 bg-[rgba(180,190,220,0.25)]">
                            {steps.map((step, i) => (
                                <div key={i} className="border-l-[3px] border-[#1e1e2e] pl-3 w-[80%]">
                                    <p className={`text-[#1e1e2e] text-[0.88rem] leading-[1.5] m-0 ${
                                        i === currentStep
                                            ? "font-semibold border-b-2 border-[#1e1e2e] pb-1"
                                            : "font-normal"
                                    }`}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 bg-[rgba(180,190,220,0.25)] flex flex-col items-center justify-center p-10 gap-7 overflow-auto">
                            <h2 className="text-white text-center text-[1rem] font-medium m-0">
                                Edite la información correspondiente
                            </h2>
                            {stepComponents[currentStep]}
                        </div>
                    </div>

                    {/* BUSCADOR — solo en paso 0 */}
                    {currentStep === 0 && (
                        <div className="w-full sm:w-[280px] shrink-0 flex flex-col gap-3 p-4 bg-white/20 rounded-xl">

                            <SearchField
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onClear={() => setSearchQuery("")}
                                placeholder="Buscar por nombre, placa o ID"
                                fullWidth
                                size="sm"
                            />

                            <div className="bg-white/45 rounded-xl border border-black/50 flex flex-col overflow-hidden">
                                <p className="text-black text-xs px-4 py-2 border-b border-white/10 shrink-0 m-0">
                                    Resultados
                                </p>
                                <div className="flex flex-col overflow-y-auto max-h-[340px]">
                                    {filteredMaterials.length > 0 ? (
                                        filteredMaterials.map((m) => (
                                            <div
                                                key={m.returnable_material_id}
                                                onClick={() => handleSelectMaterial(m)}
                                                className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-0 ${
                                                    formData.returnableMaterialId === m.returnable_material_id ? "bg-purple-300/30" : ""
                                                }`}
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-black text-xs font-medium truncate">
                                                        {m.material_element_name}
                                                    </span>
                                                    <span className="text-black/60 text-[10px] truncate">
                                                        {m.material_plate} · {m.material_brand}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-black/90 text-xs text-center py-6 m-0">
                                            Sin resultados
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
