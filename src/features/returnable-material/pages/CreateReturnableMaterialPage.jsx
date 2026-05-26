import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateReturnable1 from "../components/CreateReturnable-1";
import CreateReturnable2 from "../components/CreateReturnable-2";
import CreateReturnable3 from "../components/CreateReturnable-3";
import CreateReturnable4 from "../components/CreateReturnable-4";

const steps = [
    "1. ID - Placa SENA - Selección categoria - Nombre del elemento",
    "2. Marca - Modelo - Serial - Imagen - Fecha de compra",
    "3. Cuentadante - Cantidad - Valor unitario - Valor total",
    "4. Estado - Ficha tecnica - Descripcion - Ubicacion - Dimesiones",
];

export default function CreateReturnableMaterialPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSave = (data) => {
        const finalData = { ...formData, ...data };
        console.log("Material guardado:", finalData);
        navigate("/dashboard/returnable-material");
    };

    const stepComponents = [
        <CreateReturnable1 key={0} formData={formData} onNext={handleNext} onCancel={() => navigate("/dashboard/returnable-material")} />,
        <CreateReturnable2 key={1} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <CreateReturnable3 key={2} formData={formData} onNext={handleNext} onBack={handleBack} />,
        <CreateReturnable4 key={3} formData={formData} onSave={handleSave} onBack={handleBack} />,
    ];

    return (
        <div className="h-[calc(100vh-72px)] flex flex-col box-border py-6 px-10 gap-3 items-center justify-center">

            {/* Título */}
            <h1 className="text-white text-[1.2rem] font-semibold m-0">
                Registro material devolutivo
            </h1>

            {/* Contenedor exterior glass */}
            <div className="w-[90%] h-[75vh] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-[16px] border border-white/20 flex items-center justify-center relative">

                {/* Flecha arriba izquierda */}
                <button
                    onClick={() => navigate("/dashboard/returnable-material")}
                    className="absolute top-4 left-4 bg-transparent border-0 cursor-pointer text-white z-[1]"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Contenedor interior */}
                <div className="w-[84%] h-[89%] rounded-xl bg-[rgba(255,255,255,0.31)] flex flex-row overflow-hidden">

                    {/* Stepper */}
                    <div className="w-[37%] shrink-0 flex flex-col justify-evenly items-center p-6 bg-[rgba(180,190,220,0.25)]">
                        {steps.map((step, i) => (
                            <div key={i} className="border-l-[3px] border-[#1e1e2e] pl-3 w-[80%]">
                                <p className={`text-[#1e1e2e] text-[0.88rem] m-0 leading-[1.5] ${i === currentStep ? "font-semibold border-b-2 border-[#1e1e2e] pb-1" : "font-normal"}`}>
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Formulario */}
                    <div className="flex-1 bg-[rgba(180,190,220,0.25)] flex flex-col items-center justify-center p-10 gap-7">
                        <h2 className="text-white text-center text-[1rem] font-medium m-0">
                            Ingrese la información correspondiente
                        </h2>
                        {stepComponents[currentStep]}
                    </div>

                </div>
            </div>
        </div>
    );
}