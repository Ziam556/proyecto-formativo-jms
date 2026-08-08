import { useState, useEffect } from "react";
import { WizardStepper, alertSuccess, alertError, SearchField } from "@/shared";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getConsumableMaterials,
    updateConsumableMaterial,
} from "../services/consumableMaterialService";
import EditConsumableMaterial1 from "../components/EditConsumableMaterial-1";
import EditConsumableMaterial2 from "../components/EditConsumableMaterial-2";
import EditConsumableMaterial3 from "../components/EditConsumableMaterial-3";

const steps = [
    { num: 1, title: "Identificación",    sub: "ID · Placa · Nombre · Marca"              },
    { num: 2, title: "Información",       sub: "Imagen · Cuentadante · Cantidad · Valores" },
    { num: 3, title: "Estado y detalles", sub: "Estado · Descripción · Fecha · Ubicación · Ficha Técnica" },
];

function toWizardFields(row) {
    return {
        consumableMaterialId: row.consumable_material_id,
        materialPlate: row.material_plate || "",
        materialCategory:  row.material_category  || "",
        materialInventory: row.material_inventory || "",
        materialBrand: row.material_brand || "",
        materialElementName: row.material_element_name || "",
        materialImage: [],
        materialStoryTeller: (() => {
            const holders = Array.isArray(row.accountholders)
                ? row.accountholders
                : (() => { try { return JSON.parse(row.accountholders || "[]"); } catch { return []; } })();
            return holders.map((h) => ({
                name:     h.user_name           || "",
                document: String(h.user_document_number || ""),
                userId:   h.user_id,
            }));
        })(),
        materialAmount:    row.material_amount     != null ? String(row.material_amount)     : "",
        materialUnitValue: row.material_unit_value != null ? String(row.material_unit_value) : "",
        materialTotalValue:row.material_total_value!= null ? String(row.material_total_value): "",
        isEnabled: row.enabled ?? true,
        materialState: row.material_state || "",
        materialDescription: row.material_description || "",
        MaterialPurchaseDate: row.material_purchase_date
            ? new Date(row.material_purchase_date).toISOString().split("T")[0]
            : "",
        materialEntryDate: row.material_entry_date
            ? new Date(row.material_entry_date).toISOString().split("T")[0]
            : "",
        materialLocation: row.material_location || "",
        materialTechnicalSheet:    [],
        materialTechnicalSheetUrl: row.material_technical_sheet || null,
        materialQuotationUrls: (() => {
            if (!row.material_quotations) return [];
            try { return JSON.parse(row.material_quotations); } catch { return []; }
        })(),
    };
}

export default function EditConsumableMaterialPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData]       = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [materials, setMaterials]     = useState([]);
    const [loadError, setLoadError]     = useState(null);

    const loadMaterials = () => {
        getConsumableMaterials()
            .then(setMaterials)
            .catch((err) => setLoadError(err.message));
    };

    useEffect(() => { loadMaterials(); }, []);

    useEffect(() => {
        const materialId = location.state?.materialId;
        if (!materialId || materials.length === 0) return;
        const row = materials.find((m) => String(m.consumable_material_id) === String(materialId));
        if (row) handleSelectMaterial(row);
    }, [materials, location.state?.materialId]);

    const filteredMaterials = materials.filter((m) =>
        m.material_element_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.material_plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.consumable_material_id).includes(searchQuery)
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

        if (!finalData.consumableMaterialId) {
            alertError("Falta seleccionar material", "Selecciona un material de la lista antes de guardar.");
            return;
        }

        const payload = {
            materialPlate:        finalData.materialPlate,
            materialElementName:  finalData.materialElementName,
            materialCategory:     finalData.materialCategory  || null,
            materialInventory:    finalData.materialInventory || null,
            materialBrand:        finalData.materialBrand,
            materialStoryTeller:  finalData.materialStoryTeller,
            materialAmount:       finalData.materialAmount,
            materialUnitValue:    finalData.materialUnitValue,
            materialTotalValue:   finalData.materialTotalValue,
            materialState:        finalData.materialState,
            materialDescription:  finalData.materialDescription,
            materialPurchaseDate: finalData.MaterialPurchaseDate || null,
            materialEntryDate:    finalData.materialEntryDate    || null,
            materialLocation:     finalData.materialLocation,
            isEnabled:            finalData.isEnabled ?? true,
        };

        const imageFile = Array.isArray(finalData.materialImage)
            ? finalData.materialImage[0]
            : finalData.materialImage;

        const sheetFile = Array.isArray(finalData.materialTechnicalSheet)
            ? finalData.materialTechnicalSheet[0] ?? null
            : finalData.materialTechnicalSheet ?? null;

        // Si el usuario eliminó la ficha existente sin subir una nueva, indicarlo al backend
        if (finalData.sheetRemoved && !sheetFile) {
            payload.removeSheet = true;
        }

        // Cotizaciones: kept existing + nuevas
        const quotationFiles  = Array.isArray(finalData.materialQuotations) ? finalData.materialQuotations : [];
        payload.keepQuotations = JSON.stringify(finalData.existingQuotationUrls || []);

        try {
            await updateConsumableMaterial(finalData.consumableMaterialId, payload, imageFile, sheetFile, quotationFiles);
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
        <EditConsumableMaterial1 key={`s0-${matKey}`} formData={formData} onNext={handleNext} onCancel={() => navigate("/dashboard/consumable-material")} />,
        <EditConsumableMaterial2 key={`s1-${matKey}`} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <EditConsumableMaterial3 key={`s2-${matKey}`} formData={formData} onSave={handleSave}  onBack={handleBack} />,
    ];

    return (
        <div className="px-4 sm:px-16 py-3 sm:py-4 min-h-full flex flex-col justify-center">

            <h1 className="text-white text-sm font-semibold mb-4">
                Editar material de consumo
            </h1>

            {loadError && (
                <p className="text-red-400 text-sm mb-2">No se pudieron cargar los materiales: {loadError}</p>
            )}

            <div className="flex flex-col sm:flex-row bg-white/10 rounded-2xl">

                {/* ── STEPPER ── */}
                <WizardStepper
                    steps={steps}
                    currentStep={currentStep}
                    backTo="/dashboard/consumable-material"
                />

                {/* ── CONTENIDO ── */}
                <div className="flex-1 bg-white/10 rounded-2xl m-3 py-4 sm:py-5 px-4 sm:px-10 transition-all duration-300 flex flex-col items-center justify-center gap-6">
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
    );
}
