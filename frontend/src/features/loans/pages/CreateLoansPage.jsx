import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { BackButton, alertWarning } from "@/shared";
import { alertSuccess, alertError } from "@/shared";
import CreateLoans1 from "../components/CreateLoans-1";
import CreateLoans2 from "../components/CreateLoans-2";
import CreateLoans3 from "../components/CreateLoans-3";
import { createLoan, getMaterialsForLoan } from "../services/loanService";
import { getUsers } from "@/features/users/services/userService";

const steps = [
  { num: 1, title: "Materiales a prestar",  sub: "Búsqueda y selección"      },
  { num: 2, title: "Datos del préstamo",    sub: "Fechas y autenticación"     },
  { num: 3, title: "Justificación de uso",  sub: "Solicitudes y verificación" },
];

const stepPaddingXClass = [
  "px-3 sm:px-[28px]",
  "px-4 sm:px-[18%]",
  "px-4 sm:px-[22%]",
];

export default function CreateLoansPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData]       = useState({});
  const [materials, setMaterials]     = useState([]);
  const [saving, setSaving]           = useState(false);
  const [usersBlocked, setUsersBlocked] = useState(false);

  // Cargar materiales y verificar mínimo de usuarios al montar
  useEffect(() => {
    getMaterialsForLoan()
      .then(setMaterials)
      .catch(() => setMaterials([]));

    getUsers()
      .then((users) => {
        if (users.length < 2) {
          setUsersBlocked(true);
          alertWarning(
            "Usuarios insuficientes",
            "Debe haber al menos 2 usuarios registrados en el sistema para poder crear un préstamo."
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSave = async (data) => {
    const finalData = { ...formData, ...data };
    setSaving(true);

    const items = (finalData.selectedMaterials || []).map((m) => ({
      materialName: m.material,
      materialType: m.materialtype,
      amount:       m.amount ?? 1,
      materialId:   m.materialId ?? null,   // ID numérico para gestión de inventario
    }));

    const body = {
      fileGroup:        finalData.file            || null,
      amount:           finalData.amount          ? parseInt(finalData.amount) : null,
      departureDate:    finalData.departureDates
        ? new Date(finalData.departureDates).toISOString().split("T")[0]
        : null,
      deliveryDate:     finalData.deliveryDates
        ? new Date(finalData.deliveryDates).toISOString().split("T")[0]
        : null,
      justification:     finalData.justificationForUse || null,
      requestingUser:    finalData.user,
      notificationEmail: finalData.notificationEmail  || null,
      verificationCode:  finalData.verificationCode,
      items,
    };

    try {
      await createLoan(body);
      await alertSuccess(
        "¡Préstamo registrado!",
        "El préstamo se guardó correctamente."
      );
      // Resetear y volver al paso 1
      setFormData({});
      setCurrentStep(0);
    } catch (error) {
      await alertError("Error al guardar", error.message || "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  };

  const stepComponents = [
    <CreateLoans1
      key={0}
      materials={materials}
      formData={formData}
      onNext={handleNext}
    />,
    <CreateLoans2
      key={1}
      formData={formData}
      onNext={handleNext}
      onBack={handleBack}
    />,
    <CreateLoans3
      key={2}
      formData={formData}
      onSave={handleSave}
      onBack={handleBack}
      saving={saving}
    />,
  ];

  if (usersBlocked) {
    return (
      <div className="px-4 sm:px-16 py-6 sm:py-10 min-h-full flex items-center justify-center">
        <div className="bg-white/10 rounded-2xl p-8 max-w-md text-center">
          <p className="text-white text-2xl font-bold mb-3">⚠️ Usuarios insuficientes</p>
          <p className="text-white/70 text-sm">
            Se necesitan al menos <strong className="text-white">2 usuarios</strong> registrados en el sistema para poder crear un préstamo.
            Registra más usuarios e intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-16 py-6 sm:py-10 min-h-full">

      <h1 className="text-white text-sm font-semibold mb-4">
        Registro de préstamo
      </h1>

      <div className="flex flex-col sm:flex-row bg-white/10 rounded-2xl overflow-hidden">

        {/* ── STEPPER ─────────────────────────────────────────── */}
        <div className="sm:w-[280px] flex-shrink-0 p-4 sm:p-8 flex flex-col">

          {/* Móvil: horizontal compacto */}
          <div className="flex sm:hidden items-center gap-2 mb-4">
            <div className="mr-2">
              <BackButton to="/dashboard/loans" />
            </div>
            {steps.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent   = i === currentStep;
              return (
                <div key={step.num} className="flex items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-purple-700 text-white"
                        : "bg-white/20 text-black/60"
                    }`}
                  >
                    {isCompleted ? <Check size={12} /> : step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-6 h-[2px] ${
                        isCompleted ? "bg-green-400" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: botón volver */}
          <div className="hidden sm:flex mb-8">
            <BackButton to="/dashboard/loans" />
          </div>

          {/* Desktop: pasos verticales */}
          <div className="hidden sm:flex flex-col gap-0">
            {steps.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent   = i === currentStep;
              return (
                <div key={step.num} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full
                        flex items-center justify-center
                        text-sm font-bold flex-shrink-0
                        transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-purple-700 text-white"
                            : "bg-white/20 text-black border-2 border-black/30"
                        }
                      `}
                    >
                      {isCompleted ? <Check size={16} /> : step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-[2px] min-h-[72px] transition-colors duration-300 ${
                          isCompleted ? "bg-green-400" : "bg-white/30"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-2 pb-6">
                    <p
                      className={`text-sm ${
                        isCurrent
                          ? "font-bold text-black"
                          : isCompleted
                          ? "font-semibold text-green-300"
                          : "font-normal text-black/60"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-white/90 mt-0.5">
                      {step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO ───────────────────────────────────────── */}
        <div
          className={`flex-1 bg-white/10 rounded-2xl m-3 py-8 transition-all duration-300 ${stepPaddingXClass[currentStep]}`}
        >
          {stepComponents[currentStep]}
        </div>

      </div>
    </div>
  );
}
