import { useState, useEffect } from "react";
import { BackButton, alertSuccess, alertError, SearchField } from "@/shared";
import { useNavigate } from "react-router-dom";
import {
    getConsumableMaterials,
    updateConsumableMaterial,
} from "../services/consumableMaterialService";
import EditConsumableMaterial1 from "../components/EditConsumableMaterial-1";
import EditConsumableMaterial2 from "../components/EditConsumableMaterial-2";
import EditConsumableMaterial3 from "../components/EditConsumableMaterial-3";

const steps = [
    "1. ID - Placa SENA - Nombre del elemento - Marca",
    "2. Imagen - Cuentadante - Cantidad - Valor unitario - Valor total",
    "3. Estado - Descripcion - Fecha Compra - Ubicacion",
];

// Convierte una fila cruda del backend (snake_case) a los nombres
// camelCase que esperan los 3 pasos del wizard de edición.
function toWizardFields(row) {
    return {
        consumableMaterialId: row.consumable_material_id,
        materialPlate: row.material_plate || "",
        materialBrand: row.material_brand || "",
        materialElementName: row.material_element_name || "",
        materialImage: [],
        materialStoryTeller: row.material_story_teller || "",
        materialAmount: row.material_amount ?? "",
        materialUnitValue: row.material_unit_value ?? "",
        materialTotalValue: row.material_total_value ?? "",
        isEnabled: row.enabled ?? true,
        materialState: row.material_state || "",
        materialDescription: row.material_description || "",
        MaterialPurchaseDate: row.material_purchase_date || "",
        materialLocation: row.material_location || "",
    };
}

export default function EditConsumableMaterialPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // 📦 DATOS REALES (antes: import { consumableMaterials } from "../data/ConsumableMaterials")
    const [materials, setMaterials] = useState([]);
    const [loadError, setLoadError] = useState(null);

    const loadMaterials = () => {
        getConsumableMaterials()
            .then(setMaterials)
            .catch((err) => setLoadError(err.message));
    };

    useEffect(() => { loadMaterials(); }, []);

    const filteredMaterials = materials.filter((m) =>
        m.material_element_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.consumable_material_id).includes(searchQuery)
    );

    // Antes: el click en un resultado no hacía nada. Ahora carga el
    // material elegido en formData para que el wizard lo edite.
    const handleSelectMaterial = (row) => {
        setFormData(toWizardFields(row));
        setCurrentStep(0);
    };

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    // Antes: solo hacía console.log y navegaba, sin guardar nada.
    const handleSave = async (data) => {
        const finalData = { ...formData, ...data };

        if (!finalData.consumableMaterialId) {
            alertError("Falta seleccionar material", "Selecciona un material de la lista antes de guardar.");
            return;
        }

        const payload = {
            materialPlate: finalData.materialPlate,
            materialElementName: finalData.materialElementName,
            materialBrand: finalData.materialBrand,
            materialStoryTeller: finalData.materialStoryTeller,
            materialAmount: finalData.materialAmount,
            materialUnitValue: finalData.materialUnitValue,
            materialTotalValue: finalData.materialTotalValue,
            materialState: finalData.materialState,
            materialDescription: finalData.materialDescription,
            materialPurchaseDate: finalData.MaterialPurchaseDate,
            materialLocation: finalData.materialLocation,
            isEnabled: finalData.isEnabled ?? true,
        };

        const imageFile = Array.isArray(finalData.materialImage)
            ? finalData.materialImage[0]
            : finalData.materialImage;

        try {
            await updateConsumableMaterial(finalData.consumableMaterialId, payload, imageFile);
            alertSuccess("Material actualizado", "El material de consumo se actualizó correctamente.");
            loadMaterials();
            setFormData({});
            setCurrentStep(0);
        } catch (err) {
            console.error("Error al guardar material:", err);
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        }
    };

    const matKey = formData.consumableMaterialId ?? "empty";

    const stepComponents = [
        <EditConsumableMaterial1
            key={`s0-${matKey}`}
            formData={formData}
            onNext={handleNext}
            onCancel={() => navigate("/dashboard/consumable-material")}
        />,
        <EditConsumableMaterial2
            key={`s1-${matKey}`}
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <EditConsumableMaterial3
            key={`s2-${matKey}`}
            formData={formData}
            onSave={handleSave}
            onBack={handleBack}
        />,
    ];

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border px-3 sm:px-10 py-6 gap-3 items-center justify-center">

            <h1 className="text-white text-[1.2rem] font-semibold m-0">
                Editar material Consumo
            </h1>

            {/* Flecha regresar */}
            <div className="w-full sm:w-[90%] mx-auto">
                <BackButton to="/dashboard/consumable-material" />
            </div>

            {loadError && (
                <p className="text-red-400 text-sm">
                    No se pudieron cargar los materiales: {loadError}
                </p>
            )}

            <div className="w-full sm:w-[90%] min-h-[70vh] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-xl border border-white/20 flex items-center justify-center relative py-8">

                {/* En paso 1 muestra buscador, en pasos 2 y 3 solo el formulario */}
                <div className={`flex flex-col sm:flex-row gap-4 px-4 sm:px-0 min-h-[58vh] ${currentStep === 0 ? "w-full sm:w-[95%]" : "w-full sm:w-[84%]"}`}>

                    {/* CONTENEDOR STEPPER + FORMULARIO */}
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
                                                key={m.consumable_material_id}
                                                onClick={() => handleSelectMaterial(m)}
                                                className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-0 ${
                                                    formData.consumableMaterialId === m.consumable_material_id ? "bg-purple-300/30" : ""
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
