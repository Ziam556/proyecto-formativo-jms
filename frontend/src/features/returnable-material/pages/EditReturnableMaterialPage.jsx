import { useState, useEffect } from "react";
import { WizardStepper, alertSuccess, alertError, SearchField } from "@/shared";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getReturnableMaterials,
    updateReturnableMaterial,
} from "../services/returnableMaterialService";
import EditReturnableMaterial1 from "../components/EditReturnableMaterial-1";
import EditReturnableMaterial2 from "../components/EditReturnableMaterial-2";
import EditReturnableMaterial4 from "../components/EditReturnableMaterial-4";

const steps = [
    { num: 1, title: "Identificación",    sub: "ID · Placa · Nombre · Cuentadante" },
    { num: 2, title: "Características",   sub: "Marca · Modelo · Serial · Imagen"          },
    { num: 3, title: "Estado y detalles", sub: "Estado · Ficha · Descripción · Ubicación"  },
];

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
        materialStoryTeller:        row.material_story_teller     || "",
        isEnabled:                  row.enabled                   ?? true,
        materialState:              row.material_state            || "",
        materialTechnicalSheet:     [],
        materialTechnicalSheetUrl:  row.material_technical_sheet  || null,
        materialDescription:     row.material_description      || "",
        materialLocation:        row.material_location         || "",
        materialWidth:           row.material_width            || "",
        materialLength:          row.material_length           || "",
        materialDepth:           row.material_depth            || "",
    };
}

export default function EditReturnableMaterialPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData]       = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [materials, setMaterials]     = useState([]);
    const [loadError, setLoadError]     = useState(null);

    const loadMaterials = () => {
        getReturnableMaterials()
            .then(setMaterials)
            .catch((err) => setLoadError(err.message));
    };

    useEffect(() => { loadMaterials(); }, []);

    useEffect(() => {
        const materialId = location.state?.materialId;
        if (!materialId || materials.length === 0) return;
        const row = materials.find((m) => String(m.returnable_material_id) === String(materialId));
        if (row) handleSelectMaterial(row);
    }, [materials, location.state?.materialId]);

    const filteredMaterials = materials.filter((m) =>
        m.material_element_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.returnable_material_id).includes(searchQuery)
    );

    const handleSelectMaterial = (row) => {
        setFormData(toWizardFields(row));
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
            materialState:        finalData.materialState,
            materialDescription:  finalData.materialDescription,
            materialLocation:     finalData.materialLocation,
            materialWidth:        finalData.materialWidth,
            materialLength:       finalData.materialLength,
            materialDepth:        finalData.materialDepth,
            isEnabled:            finalData.isEnabled ?? true,
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
        <EditReturnableMaterial1 key={`s0-${matKey}`} formData={formData} onNext={handleNext} onCancel={() => navigate("/dashboard/returnable-material")} />,
        <EditReturnableMaterial2 key={`s1-${matKey}`} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <EditReturnableMaterial4 key={`s2-${matKey}`} formData={formData} onSave={handleSave}  onBack={handleBack} />,
    ];

    return (
        <div className="px-4 sm:px-16 py-6 sm:py-10 min-h-[calc(100vh-72px)] flex flex-col justify-center">

            <h1 className="text-white text-sm font-semibold mb-4">
                Editar material devolutivo
            </h1>

            {loadError && (
                <p className="text-red-400 text-sm mb-2">No se pudieron cargar los materiales: {loadError}</p>
            )}

            <div className="flex flex-col sm:flex-row bg-white/10 rounded-2xl overflow-hidden">

                {/* ── STEPPER ── */}
                <WizardStepper
                    steps={steps}
                    currentStep={currentStep}
                    backTo="/dashboard/returnable-material"
                />

                {/* ── CONTENIDO ── */}
                <div className="flex-1 bg-white/10 rounded-2xl m-3 py-8 px-4 sm:px-10 transition-all duration-300 flex flex-col items-center justify-center gap-6">
                    <h2 className="text-white text-center text-[1rem] font-medium m-0">
                        Edite la información correspondiente
                    </h2>
                    {stepComponents[currentStep]}
                </div>

                {/* ── BUSCADOR — solo en paso 0 ── */}
                {currentStep === 0 && (
                    <div className="w-full sm:w-[240px] flex-shrink-0 flex flex-col gap-3 p-4 bg-white/5 m-3 ml-0 rounded-xl">
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
    );
}
