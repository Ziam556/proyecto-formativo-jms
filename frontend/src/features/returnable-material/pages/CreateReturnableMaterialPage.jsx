import { useState } from "react";
import { WizardStepper, alertSuccess, alertError } from "@/shared";
import { useNavigate } from "react-router-dom";
import { createReturnableMaterial } from "../services/returnableMaterialService";
import CreateReturnable1 from "../components/CreateReturnable-1";
import CreateReturnable2 from "../components/CreateReturnable-2";
import CreateReturnable4 from "../components/CreateReturnable-4";

const steps = [
    { num: 1, title: "Identificación",    sub: "ID · Placa · Categoría · Nombre · Cuentadante" },
    { num: 2, title: "Características",   sub: "Marca · Modelo · Serial · Imagen"          },
    { num: 3, title: "Estado y detalles", sub: "Estado · Ficha · Descripción · Ubicación"  },
];

export default function CreateReturnableMaterialPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData]       = useState({});

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSave = async (data) => {
        const finalData = { ...formData, ...data };

        try {
            const purchaseDate = finalData.MaterialPurchaseDate
                ? new Date(finalData.MaterialPurchaseDate).toISOString().split("T")[0]
                : null;

            const payload = { ...finalData, materialPurchaseDate: purchaseDate };

            const imageFiles         = finalData.materialImage             ?? [];
            const technicalSheetFile = finalData.materialTechnicalSheet?.[0] ?? null;

            await createReturnableMaterial(payload, imageFiles, technicalSheetFile);

            await alertSuccess("¡Material creado!", "El material devolutivo se registró correctamente.");
            setFormData({});
            setCurrentStep(0);

        } catch (err) {
            console.error("Error al guardar material devolutivo:", err);
            await alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
        }
    };

    const stepComponents = [
        <CreateReturnable1 key={0} formData={formData} onNext={handleNext} onCancel={() => navigate("/dashboard/returnable-material")} />,
        <CreateReturnable2 key={1} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <CreateReturnable4 key={2} formData={formData} onSave={handleSave}  onBack={handleBack} />,
    ];

    return (
        <div className="px-4 sm:px-16 py-6 sm:py-10 min-h-[calc(100vh-72px)] flex flex-col justify-center">

            <h1 className="text-white text-sm font-semibold mb-4">
                Registro material devolutivo
            </h1>

            <div className="flex flex-col sm:flex-row bg-white/10 rounded-2xl overflow-hidden">

                {/* ── STEPPER ── */}
                <WizardStepper
                    steps={steps}
                    currentStep={currentStep}
                    backTo="/dashboard/returnable-material"
                />

                {/* ── CONTENIDO ── */}
                <div className="flex-1 bg-white/10 rounded-2xl m-3 py-8 px-4 sm:px-12 transition-all duration-300 flex flex-col items-center justify-center gap-6">
                    <h2 className="text-white text-center text-[1rem] font-medium m-0">
                        Ingrese la información correspondiente
                    </h2>
                    {stepComponents[currentStep]}
                </div>

            </div>
        </div>
    );
}
