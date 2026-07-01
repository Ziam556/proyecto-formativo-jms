import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Send, ArrowLeft, Info } from "lucide-react";
import { Button, Input, BackButton } from "@/shared";
import { StepRing } from "@/shared";

export default function ForgotPasswordPage1({ onNext }) {
    const navigate        = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!email.trim()) { setError("El correo es requerido"); return; }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) { setError("Correo no válido"); return; }
        onNext(email);
    };

    return (
        <>
            {/* Volver */}
            <div className="flex items-center gap-1 mb-6">
                <BackButton onClick={() => navigate("/auth")} />
                <span className="text-[rgba(255,255,255,0.65)] text-[0.82rem]">Volver</span>
            </div>

            {/* Icono con anillo paso 1/3 */}
            <div className="flex justify-center mb-5">
                <StepRing step={1}>
                    <Lock size={28} color="#50E5F9" strokeWidth={1.8} />
                </StepRing>
            </div>

            {/* Títulos */}
            <h2 className="text-white font-bold text-[1.3rem] text-center mb-1">
                Recuperar contraseña
            </h2>
            <p className="text-[rgba(255,255,255,0.6)] text-[0.83rem] text-center mb-6 leading-[1.6]">
                Ingresa tu correo electrónico registrado para<br />enviarte un código de recuperación.
            </p>

            {/* Input correo */}
            <Input
                label="Correo electrónico registrado"
                type="email"
                placeholder="Escribe tu correo electrónico"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                error={error}
                labelVariant="light"
            />

            {/* Info */}
            <div className="flex items-start gap-3 bg-[rgba(80,229,249,0.08)] border border-[rgba(80,229,249,0.2)] rounded-[10px] px-4 py-3 mt-4">
                <Info size={16} color="#50E5F9" className="shrink-0 mt-[2px]" />
                <p className="text-[rgba(255,255,255,0.7)] text-[0.8rem] leading-[1.5]">
                    Te enviaremos un código de verificación a tu correo para restablecer tu contraseña.
                </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 mt-6">
                <Button variant="primary" size="md" onClick={handleSubmit}>
                    <Send size={16} className="mr-2" /> Enviar código
                </Button>

                <div className="flex items-center gap-3 my-1">
                    <hr className="flex-1 border-[rgba(255,255,255,0.15)]" />
                    <span className="text-[rgba(255,255,255,0.4)] text-[0.78rem]">o</span>
                    <hr className="flex-1 border-[rgba(255,255,255,0.15)]" />
                </div>

                <Button variant="secondary" size="md" onClick={() => navigate("/auth")}>
                    <ArrowLeft size={16} className="mr-2" /> Regresar a inicio
                </Button>
            </div>
        </>
    );
}
