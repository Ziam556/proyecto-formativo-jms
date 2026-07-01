import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, RefreshCw, Clock, ArrowLeft, Info } from "lucide-react";
import { Button, BackButton } from "@/shared";
import { StepRing } from "@/shared";

// ─── OTP 6 cajas ─────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;

function OtpInput({ value, onChange }) {
    const refs = useRef([]);

    const handleKey = (e, idx) => {
        if (e.key === "Backspace") {
            if (!value[idx] && idx > 0) refs.current[idx - 1].focus();
            const next = value.split("");
            next[idx] = "";
            onChange(next.join(""));
            return;
        }
        if (e.key === "ArrowLeft"  && idx > 0)              refs.current[idx - 1].focus();
        if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) refs.current[idx + 1].focus();
    };

    const handleChange = (e, idx) => {
        const char = e.target.value.replace(/\D/g, "").slice(-1);
        const next = value.split("");
        next[idx]  = char;
        onChange(next.join(""));
        if (char && idx < OTP_LENGTH - 1) refs.current[idx + 1].focus();
    };

    const handlePaste = (e) => {
        const paste    = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        onChange(paste.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH));
        refs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
        e.preventDefault();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKey(e, i)}
                    onPaste={handlePaste}
                    className="w-11 h-12 text-center text-[1.1rem] font-bold text-white
                        bg-[rgba(255,255,255,0.07)] border-2 border-[rgba(255,255,255,0.2)]
                        rounded-[10px] outline-none focus:border-[#50E5F9] focus:bg-[rgba(80,229,249,0.08)]
                        transition-colors"
                />
            ))}
        </div>
    );
}

// ─── Vista 2 ─────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage2({ email, onNext, onBack }) {
    const navigate              = useNavigate();
    const [otp, setOtp]         = useState("");
    const [error, setError]     = useState("");
    const [seconds, setSeconds] = useState(10 * 60);
    const [resent, setResent]   = useState(false);

    useEffect(() => {
        if (seconds <= 0) return;
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds]);

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const handleValidate = () => {
        if (otp.replace(/\D/g, "").length < OTP_LENGTH) {
            setError("Ingresa los 6 dígitos del código");
            return;
        }
        onNext();
    };

    const handleResend = () => {
        setSeconds(10 * 60);
        setOtp("");
        setError("");
        setResent(true);
        setTimeout(() => setResent(false), 3000);
    };

    return (
        <>
            {/* Volver */}
            <div className="flex items-center gap-1 mb-6">
                <BackButton onClick={onBack} />
                <span className="text-[rgba(255,255,255,0.65)] text-[0.82rem]">Volver</span>
            </div>

            {/* Icono con anillo paso 2/3 */}
            <div className="flex justify-center mb-5">
                <StepRing step={2}>
                    <Mail size={28} color="#50E5F9" strokeWidth={1.8} />
                </StepRing>
            </div>

            {/* Títulos */}
            <h2 className="text-white font-bold text-[1.3rem] text-center mb-1">
                Validación de código
            </h2>
            <p className="text-[rgba(255,255,255,0.6)] text-[0.83rem] text-center mb-1 leading-[1.6]">
                Hemos enviado un código de 6 dígitos a:
            </p>
            <p className="text-[#50E5F9] text-[0.87rem] font-semibold text-center mb-6">
                {email}
            </p>

            {/* OTP */}
            <label className="block text-[12px] font-semibold text-white mb-3 text-center">
                Ingresa el código recibido
            </label>
            <OtpInput value={otp} onChange={(v) => { setOtp(v); setError(""); }} />
            {error && <p className="text-red-400 text-[0.78rem] text-center mt-2">{error}</p>}

            {/* Temporizador */}
            <div className="flex items-center justify-center gap-2 mt-4">
                <Clock size={14} color="rgba(255,255,255,0.5)" />
                <span className={`text-[0.8rem] ${seconds <= 60 ? "text-red-400" : "text-[rgba(255,255,255,0.5)]"}`}>
                    El código expirará en {mm}:{ss} minutos
                </span>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 mt-5">
                <Button variant="primary" size="md" onClick={handleValidate}>
                    <CheckCircle2 size={16} className="mr-2" /> Validar código
                </Button>

                <button
                    onClick={handleResend}
                    className="flex items-center justify-center gap-2 text-[rgba(255,255,255,0.65)] text-[0.83rem] bg-transparent border-0 cursor-pointer hover:text-white transition-colors py-1"
                >
                    <RefreshCw size={14} />
                    {resent ? "¡Código reenviado!" : "Reenviar código"}
                </button>

                <div className="flex items-center gap-3 my-1">
                    <hr className="flex-1 border-[rgba(255,255,255,0.15)]" />
                    <span className="text-[rgba(255,255,255,0.4)] text-[0.78rem]">o</span>
                    <hr className="flex-1 border-[rgba(255,255,255,0.15)]" />
                </div>

                <Button variant="secondary" size="md" onClick={() => navigate("/auth")}>
                    <ArrowLeft size={16} className="mr-2" /> Regresar a inicio
                </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-[rgba(255,255,255,0.45)] text-[0.78rem] mb-1">
                    ¿No recibiste el código?
                </p>
                <p className="flex items-center gap-1 justify-center text-[rgba(255,255,255,0.45)] text-[0.78rem]">
                    <Info size={13} /> Verifica tu bandeja de spam o reenvíalo
                </p>
            </div>
        </>
    );
}
