import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import CreateLoans1 from "../components/CreateLoans-1";
import CreateLoans2 from "../components/CreateLoans-2";
import CreateLoans3 from "../components/CreateLoans-3";
import { createLoan } from "../services/loanService";
import { Loans } from "../data/Loans";

const steps = [
  { num: 1, title: "Materiales a prestar",  sub: "Búsqueda y selección"      },
  { num: 2, title: "Datos del préstamo",    sub: "Fechas y autenticación"     },
  { num: 3, title: "Justificación de uso",  sub: "Solicitudes y verificación" },
];

// Clase de padding horizontal del panel de contenido según el paso
const stepPaddingXClass = ["px-3 sm:px-[28px]", "px-4 sm:px-[18%]", "px-4 sm:px-[22%]"];

export default function CreateLoansPage() {
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

    // Convertir rowSelection (índices) a items del préstamo
    const selectedIndexes = Object.keys(finalData.rowSelection || {}).filter(
      (k) => finalData.rowSelection[k]
    );
    const items = selectedIndexes.map((i) => ({
      materialName: Loans[i].material,
      materialType: Loans[i].materialtype,
      amount: Loans[i].amount,
    }));

    const body = {
      fileGroup: finalData.file || null,
      amount: finalData.amount ? parseInt(finalData.amount) : null,
      departureDate: finalData.departureDates
        ? new Date(finalData.departureDates).toISOString().split("T")[0]
        : null,
      deliveryDate: finalData.deliveryDates
        ? new Date(finalData.deliveryDates).toISOString().split("T")[0]
        : null,
      justification: finalData.justificationForUse || null,
      requestingUser: finalData.user,
      verificationCode: finalData.verificationCode,
      items,
    };

    try {
      await createLoan(body);
      setFormData({});
      setCurrentStep(0);
    } catch (error) {
      console.error("Error al guardar préstamo:", error.message);
    }
  };

  const stepComponents = [
    <CreateLoans1 key={0} formData={formData} onNext={handleNext} />,
    <CreateLoans2 key={1} formData={formData} onNext={handleNext} onBack={handleBack} />,
    <CreateLoans3 key={2} formData={formData} onSave={handleSave}  onBack={handleBack} />,
  ];

  return (
    <div className="px-4 sm:px-16 py-6 sm:py-10 min-h-[calc(100vh-64px)]">

      <h1 className="text-white text-sm font-semibold mb-4">
        Registro de prestamo
      </h1>

      <div className="flex flex-col sm:flex-row bg-white/10 rounded-2xl overflow-hidden">

        {/* ── STEPPER ─────────────────────────────────────────── */}
        <div className="sm:w-[280px] flex-shrink-0 p-4 sm:p-8 flex flex-col">

          {/* En móvil: stepper horizontal compacto */}
          <div className="flex sm:hidden items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/dashboard/loans")}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/30 text-white transition mr-2"
            >
              <ArrowLeft size={16} />
            </button>
            {steps.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent   = i === currentStep;
              return (
                <div key={step.num} className="flex items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-purple-700 text-white" : "bg-white/20 text-black/60"}`}>
                    {isCompleted ? <Check size={12} /> : step.num}
                  </div>
                  {i < steps.length - 1 && <div className={`w-6 h-[2px] ${isCompleted ? "bg-green-400" : "bg-white/30"}`} />}
                </div>
              );
            })}
          </div>

          {/* Botón volver — solo en desktop */}
          <button
            onClick={() => navigate("/dashboard/loans")}
            className="
              hidden sm:flex
              w-9 h-9 mb-8
              items-center justify-center
              rounded-full
              hover:bg-white/30
              text-white
              transition
            "
          >
            <ArrowLeft size={16} />
          </button>

          {/* Pasos — solo en desktop */}
          <div className="hidden sm:flex flex-col gap-0">
            {steps.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent   = i === currentStep;

              return (
                <div key={step.num} className="flex gap-3">

                  {/* Círculo + línea */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full
                        flex items-center justify-center
                        text-sm font-bold
                        flex-shrink-0
                        transition-all duration-300
                        ${isCompleted ? "bg-green-500 text-white"
                          : isCurrent  ? "bg-purple-700 text-white"
                          : "bg-white/20 text-black border-2 border-black/30"}
                      `}
                    >
                      {isCompleted ? <Check size={16} /> : step.num}
                    </div>

                    {i < steps.length - 1 && (
                      <div className={`
                        w-[2px] min-h-[72px]
                        transition-colors duration-300
                        ${isCompleted ? "bg-green-400" : "bg-white/30"}
                      `} />
                    )}
                  </div>

                  {/* Texto */}
                  <div className="pt-2 pb-6">
                    <p className={`text-sm ${isCurrent ? "font-bold text-white" : isCompleted ? "font-semibold text-green-300" : "font-normal text-black/70"}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-black/50 mt-0.5">
                      {step.sub}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO ───────────────────────────────────────── */}
        <div className={`flex-1 bg-white/10 rounded-2xl m-3 py-8 transition-all duration-300 ${stepPaddingXClass[currentStep]}`}>
          {stepComponents[currentStep]}
        </div>

      </div>
    </div>
  );
}
