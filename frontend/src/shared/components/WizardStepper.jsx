import { Check } from "lucide-react";
import BackButton from "./BackButton";

/**
 * WizardStepper — barra lateral animada de pasos para wizards multi-paso.
 *
 * Props:
 *  steps        — array de { num, title, sub }
 *  currentStep  — índice del paso activo (0-based)
 *  backTo       — ruta para el BackButton
 */
export default function WizardStepper({ steps, currentStep, backTo }) {
  return (
    <div className="sm:w-[260px] flex-shrink-0 p-4 sm:p-8 flex flex-col">

      {/* ── Móvil: horizontal compacto ── */}
      <div className="flex sm:hidden items-center gap-2 mb-4">
        <div className="mr-2">
          <BackButton to={backTo} />
        </div>
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent   = i === currentStep;
          return (
            <div key={step.num} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
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
                  className={`w-6 h-[2px] transition-colors duration-300 ${
                    isCompleted ? "bg-green-400" : "bg-white/30"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Desktop: botón volver ── */}
      <div className="hidden sm:flex mb-8">
        <BackButton to={backTo} />
      </div>

      {/* ── Desktop: pasos verticales ── */}
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
                        : "bg-white/20 text-[#0f172a] border-2 border-gray-600/40"
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
                  className={`text-sm leading-snug ${
                    isCurrent
                      ? "font-bold text-white"
                      : isCompleted
                      ? "font-semibold text-green-300"
                      : "font-semibold text-[#0f172a]"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-[#1e293b] mt-0.5">{step.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
