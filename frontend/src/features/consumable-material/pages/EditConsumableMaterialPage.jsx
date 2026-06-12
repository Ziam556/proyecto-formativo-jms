import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { consumableMaterials } from "../data/consumableMaterials";
import EditConsumableMaterial1 from "../components/EditConsumableMaterial-1";
import EditConsumableMaterial2 from "../components/EditConsumableMaterial-2";
import EditConsumableMaterial3 from "../components/EditConsumableMaterial-3";

const steps = [
    "1. ID - Placa SENA - Nombre del elemento - Marca",
    "2. Imagen - Cuentadante - Cantidad - Valor unitario - Valor total",
    "3. Estado - Descripcion - Fecha Compra - Ubicacion",
];

export default function EditConsumableMaterialPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMaterials = consumableMaterials.filter((m) =>
        m.elementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.plateSena.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(m.id).includes(searchQuery)
    );

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSave = (data) => {
        const finalData = { ...formData, ...data };
        console.log("Material guardado:", finalData);
        navigate("/dashboard/consumable-material");
    };

    const stepComponents = [
        <EditConsumableMaterial1
            key={0}
            formData={formData}
            onNext={handleNext}
            onCancel={() => navigate("/dashboard/consumable-material")}
        />,
        <EditConsumableMaterial2
            key={1}
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
        />,
        <EditConsumableMaterial3
            key={2}
            formData={formData}
            onSave={handleSave}
            onBack={handleBack}
        />,
    ];

    return (
        <div className="h-[calc(100vh-72px)] flex flex-col box-border px-10 py-6 gap-3 items-center justify-center">

            <h1 className="text-white text-[1.2rem] font-semibold m-0">
                Editar material Consumo
            </h1>

            <div className="w-[90%] h-[75vh] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-xl border border-white/20 flex items-center justify-center relative">

                <button
                    onClick={() => navigate("/dashboard/consumable-material")}
                    className="absolute top-4 left-4 bg-transparent border-none cursor-pointer text-white z-[1]"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* En paso 1 muestra buscador, en pasos 2 y 3 solo el formulario */}
                <div className={`h-[89%] flex flex-row gap-4 ${currentStep === 0 ? "w-[95%]" : "w-[84%]"}`}>

                    {/* CONTENEDOR STEPPER + FORMULARIO */}
                    <div className="flex-1 rounded-xl bg-white/30 flex flex-row overflow-hidden">

                        {/* STEPPER */}
                        <div className="w-[37%] shrink-0 flex flex-col justify-evenly items-center p-6 bg-[rgba(180,190,220,0.25)]">
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
                        <div className="w-[280px] shrink-0 flex flex-col gap-3 p-4 bg-white/20 rounded-xl">

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-sm">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, placa o ID"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/20 placeholder-black/50 border border-black/80 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs"
                                />
                            </div>

                            <div className="bg-white/45 rounded-xl border border-black/50 flex flex-col overflow-hidden flex-1">
                                <p className="text-black text-xs px-4 py-2 border-b border-white/10 shrink-0 m-0">
                                    Resultados
                                </p>
                                <div className="flex flex-col overflow-y-auto flex-1">
                                    {filteredMaterials.length > 0 ? (
                                        filteredMaterials.map((m) => (
                                            <div
                                                key={m.id}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-0"
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-black text-xs font-medium truncate">
                                                        {m.elementName}
                                                    </span>
                                                    <span className="text-black/60 text-[10px] truncate">
                                                        {m.plateSena} · {m.brand}
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