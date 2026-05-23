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
        <div style={{
            height: "calc(100vh - 72px)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            padding: "24px 40px",      // más padding para que no pegue a los bordes
            gap: "12px",
            alignItems: "center",      // centra el contenedor exterior
            justifyContent: "center",  // centra verticalmente
        }}>
            {/* Título */}
            <h1 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
                Registro material devolutivo
            </h1>

            {/* Contenedor exterior */}
            <div style={{
                width: "90%",              // menos ancho
                height: "75vh",            // altura fija, no ocupa todo
                margin: "0 auto",          // centra horizontalmente
                borderRadius: "16px",
                background: "rgba(217,217,217,0.31)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}>
                {/* Flecha arriba izquierda del exterior */}
                <button
                    onClick={() => navigate("/dashboard/returnable-material")}
                    style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        zIndex: 1,
                    }}
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Contenedor interior */}
                <div style={{
                    width: "84%",           // 1535/1827
                    height: "89%",          // 609/685
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.31)",
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                }}>
                    {/* Stepper */}
                    <div style={{
                        width: "37%",
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        padding: "24px",
                        background: "rgba(180,190,220,0.25)",  
                    }}>
                        {steps.map((step, i) => (
                        <div key={i} style={{
                            borderLeft: "3px solid #1e1e2e",  
                            paddingLeft: "12px",
                            width: "80%",
                        }}>
                            <p style={{
                                color: "#1e1e2e",              
                                fontSize: "0.88rem",
                                fontWeight: i === currentStep ? 600 : 400,
                                margin: 0,
                                lineHeight: 1.5,
                                borderBottom: i === currentStep ? "2px solid #1e1e2e" : "none",
                                paddingBottom: i === currentStep ? "4px" : "0",
                            }}>
                                {step}
                            </p>
                        </div>
                    ))}
                    </div>
                    
                    {/* Formulario */}
                    <div style={{
                        flex: 1,
                        background: "rgba(180,190,220,0.25)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        gap: "28px",
                    }}>
                        <h2 style={{
                            color: "#fff",
                            textAlign: "center",
                            fontSize: "1rem",
                            fontWeight: 500,
                            margin: 0,
                        }}>
                            Ingrese la información correspondiente
                        </h2>
                        {stepComponents[currentStep]}
                    </div>
                </div>
            </div>
        </div>
    );
}