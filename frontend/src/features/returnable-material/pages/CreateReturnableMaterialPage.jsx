import { useState } from "react";
import { BackButton } from "@/shared";
import { useNavigate } from "react-router-dom";
import { createReturnableMaterial } from "../services/returnableMaterialService";
import CreateReturnable1 from "../components/CreateReturnable-1";
import CreateReturnable2 from "../components/CreateReturnable-2";
import CreateReturnable3 from "../components/CreateReturnable-3";
import CreateReturnable4 from "../components/CreateReturnable-4";

const steps = [
    "1. ID - Placa SENA - Categoría - Nombre del elemento",
    "2. Marca - Modelo - Serial - Imagen - Fecha de compra",
    "3. Cuentadante - Cantidad - Valor unitario - Valor total",
    "4. Estado - Ficha tecnica - Descripcion - Ubicacion - Dimesiones",
];

export default function CreateReturnableMaterialPage() {
    console.log("CREATE PAGE RENDER");
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

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

            const imageFile          = finalData.materialImage?.[0]          ?? null;
            const technicalSheetFile = finalData.materialTechnicalSheet?.[0] ?? null;

            await createReturnableMaterial(payload, imageFile, technicalSheetFile);

            setFormData({});
            setCurrentStep(0);

        } catch (err) {
            console.error("Error al guardar material devolutivo:", err);
            alert("Error al guardar: " + err.message);
        }
    };

    const stepComponents = [
        <CreateReturnable1 key={0} formData={formData} onNext={handleNext} onCancel={() => navigate("/dashboard/returnable-material")} />,
        <CreateReturnable2 key={1} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <CreateReturnable3 key={2} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <CreateReturnable4 key={3} formData={formData} onSave={handleSave} onBack={handleBack} />,
    ];

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border py-6 px-4 sm:px-10 gap-3 items-center justify-center">

            {/* Título */}
            <h1 className="text-white text-[1rem] sm:text-[1.2rem] font-semibold m-0">
                Registro material devolutivo
            </h1>

            {/* Contenedor exterior glass */}
            <div className="w-full max-w-[95%] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-[16px] border border-white/20 flex items-center justify-center relative py-8 sm:py-0 sm:h-[75vh]">

                {/* Flecha arriba izquierda */}
                <BackButton to="/dashboard/returnable-material" />

                {/* Contenedor interior */}
                <div className="w-[95%] sm:w-[84%] h-auto sm:h-[89%] rounded-xl bg-[rgba(255,255,255,0.31)] flex flex-col sm:flex-row overflow-hidden">

                    {/* Stepper */}
                    <div className="sm:w-[37%] shrink-0 flex flex-col justify-evenly items-center p-4 sm:p-6 bg-[rgba(180,190,220,0.25)] gap-3 sm:gap-0">
                        {steps.map((step, i) => (
                            <div key={i} className="border-l-[3px] border-[#1e1e2e] pl-3 w-[90%] sm:w-[80%]">
                                <p className={`text-[#1e1e2e] text-[0.8rem] sm:text-[0.88rem] m-0 leading-[1.5] ${i === currentStep ? "font-semibold border-b-2 border-[#1e1e2e] pb-1" : "font-normal"}`}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Formulario */}
                    <div className="flex-1 bg-[rgba(180,190,220,0.25)] flex flex-col items-center justify-center p-4 sm:p-10 gap-4 sm:gap-7">
                        <h2 className="text-white text-center text-[0.9rem] sm:text-[1rem] font-medium m-0">
                            Ingrese la información correspondiente
                        </h2>
                        {stepComponents[currentStep]}
                    </div>

                </div>
            </div>
        </div>
    );
}