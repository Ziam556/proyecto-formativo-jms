import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createConsumableMaterial } from "../services/consumableMaterialService";

import CreateConsumable1 from "../components/CreateConsumable-1";
import CreateConsumable2 from "../components/CreateConsumable-2";
import CreateConsumable3 from "../components/CreateConsumable-3";

const steps = [
    "1. ID - Placa SENA - Nombre del elemento - Marca",
    "2. Imagen - Cuentadante - Cantidad - Valor unitario - Valor total",
    "3. Estado - Descripcion - Fecha Compra - Ubicacion",
];

export default function CreateConsumableMaterialPage() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
        setFormData((prev) => ({
            ...prev,
            ...data,
        }));

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () =>
        setCurrentStep((prev) => prev - 1);

    const handleSave = async (data) => {
        const finalData = { ...formData, ...data };

        try {
            // MaterialPurchaseDate viene como objeto Date del datepicker, lo convertimos a string
            const purchaseDate = finalData.MaterialPurchaseDate
                ? new Date(finalData.MaterialPurchaseDate).toISOString().split("T")[0]
                : null;

            const payload = { ...finalData, materialPurchaseDate: purchaseDate };

            // La imagen es un array de File, tomamos el primero
            const imageFile = finalData.materialImage?.[0] ?? null;

            await createConsumableMaterial(payload, imageFile);

            setFormData({});
            setCurrentStep(0);

        } catch (err) {
            console.error("Error al guardar material:", err);
            alert("Error al guardar: " + err.message);
        }
    };

    const stepComponents = [
        <CreateConsumable1
            key={0}
            formData={formData}
            onNext={handleNext}
            onCancel={() =>
                navigate("/dashboard/consumable-material")
            }
        />,

        <CreateConsumable2
            key={1}
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,

        <CreateConsumable3
            key={2}
            formData={formData}
            onSave={handleSave}
            onBack={handleBack}
        />,
    ];

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border px-4 sm:px-10 py-6 gap-3 items-center justify-center">

            {/* TÍTULO */}
            <h1 className="text-white text-[1rem] sm:text-[1.2rem] font-semibold m-0">
                Registro material Consumo
            </h1>

            {/* CONTENEDOR EXTERIOR */}
            <div className="w-full max-w-[95%] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-xl border border-white/20 flex items-center justify-center relative py-8 sm:py-0 sm:h-[75vh]">

                {/* FLECHA */}
                <button
                    onClick={() => navigate("/dashboard/consumable-material")}
                    className="absolute top-4 left-4 bg-transparent border-none cursor-pointer text-white z-[1]"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* CONTENEDOR INTERIOR */}
                <div className="w-[95%] sm:w-[84%] h-auto sm:h-[89%] rounded-xl bg-white/30 flex flex-col sm:flex-row overflow-hidden">

                    {/* STEPPER */}
                    <div className="sm:w-[37%] shrink-0 flex flex-col justify-evenly items-center p-4 sm:p-6 bg-[rgba(180,190,220,0.25)] gap-3 sm:gap-0">

                        {steps.map((step, i) => (
                            <div key={i} className="border-l-[3px] border-[#1e1e2e] pl-3 w-[90%] sm:w-[80%]">
                                <p className={`text-[#1e1e2e] text-[0.8rem] sm:text-[0.88rem] leading-[1.5] m-0 ${i === currentStep ? "font-semibold border-b-2 border-[#1e1e2e] pb-1" : "font-normal"}`}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* FORMULARIO */}
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