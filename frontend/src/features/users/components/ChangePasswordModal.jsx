import { useState, useEffect, useRef } from "react";
import { X, Lock, Mail, Eye, EyeOff, CheckCircle2, RefreshCw, Clock, Send } from "lucide-react";
import { Button, Input, StepRing } from "@/shared";
import { sendOtp, verifyOtp, resetPassword } from "@/features/auth/services/forgotPasswordService";

// ─── Requisitos contraseña ────────────────────────────────────────────────────
const REQUIREMENTS = [
    { key: "length",  label: "Al menos 10 caracteres",           test: (p) => p.length >= 10 },
    { key: "upper",   label: "Una letra mayúscula",               test: (p) => /[A-Z]/.test(p) },
    { key: "lower",   label: "Una letra minúscula",               test: (p) => /[a-z]/.test(p) },
    { key: "number",  label: "Un número",                         test: (p) => /\d/.test(p) },
    { key: "special", label: "Un carácter especial (ej. !@#$%)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];
const STRENGTH_COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E"];
const STRENGTH_LABELS = ["Muy débil", "Débil", "Moderada", "Fuerte"];
const OTP_LENGTH = 6;

// ─── Barra de fortaleza ───────────────────────────────────────────────────────
function PasswordStrength({ password }) {
    if (!password) return null;
    const passed   = REQUIREMENTS.filter((r) => r.test(password)).length;
    const strength = Math.min(4, Math.ceil(passed * 4 / 5));
    const color    = STRENGTH_COLORS[strength - 1] || "#374151";
    return (
        <div className="mt-2 mb-1">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-[4px] rounded-full transition-colors duration-300"
                        style={{ backgroundColor: i <= strength ? color : "rgba(255,255,255,0.12)" }} />
                ))}
            </div>
            <p className="text-right text-[0.75rem] font-semibold" style={{ color }}>
                {STRENGTH_LABELS[strength - 1] || ""}
            </p>
        </div>
    );
}

// ─── Input OTP ───────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
    const refs = useRef([]);
    const handleKey = (e, idx) => {
        if (e.key === "Backspace") {
            if (!value[idx] && idx > 0) refs.current[idx - 1].focus();
            const next = value.split(""); next[idx] = ""; onChange(next.join("")); return;
        }
        if (e.key === "ArrowLeft"  && idx > 0)              refs.current[idx - 1].focus();
        if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) refs.current[idx + 1].focus();
    };
    const handleChange = (e, idx) => {
        const char = e.target.value.replace(/\D/g, "").slice(-1);
        const next = value.split(""); next[idx] = char; onChange(next.join(""));
        if (char && idx < OTP_LENGTH - 1) refs.current[idx + 1].focus();
    };
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        onChange(paste.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH));
        refs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
        e.preventDefault();
    };
    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input key={i} ref={(el) => (refs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1}
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

// ─── Modal principal ──────────────────────────────────────────────────────────
export default function ChangePasswordModal({ email, onClose }) {
    // step: "sending" | "otp" | "password" | "success"
    const [step,     setStep]     = useState("sending");
    const [otp,      setOtp]      = useState("");
    const [otpError, setOtpError] = useState("");
    const [seconds,  setSeconds]  = useState(10 * 60);
    const [resent,   setResent]   = useState(false);
    const [loadOtp,  setLoadOtp]  = useState(false);

    const [password, setPassword] = useState("");
    const [confirm,  setConfirm]  = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [passErrors, setPassErrors] = useState({});
    const [loadPass, setLoadPass] = useState(false);
    const [savedOtp, setSavedOtp] = useState("");

    // Auto-enviar OTP al abrir
    useEffect(() => {
        sendOtp(email)
            .then(() => setStep("otp"))
            .catch(() => setStep("otp")); // si falla igual pasa a otp, el usuario puede reenviar
    }, [email]);

    // Temporizador
    useEffect(() => {
        if (step !== "otp" || seconds <= 0) return;
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [step, seconds]);

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    const handleValidateOtp = async () => {
        if (otp.replace(/\D/g, "").length < OTP_LENGTH) { setOtpError("Ingresa los 6 dígitos"); return; }
        try {
            setLoadOtp(true);
            await verifyOtp(email, otp);
            setSavedOtp(otp);
            setStep("password");
        } catch (err) {
            setOtpError(err.message);
        } finally {
            setLoadOtp(false);
        }
    };

    const handleResend = async () => {
        try {
            await sendOtp(email);
            setSeconds(10 * 60); setOtp(""); setOtpError("");
            setResent(true); setTimeout(() => setResent(false), 3000);
        } catch { setOtpError("Error al reenviar. Intenta de nuevo."); }
    };

    const passed = REQUIREMENTS.filter((r) => r.test(password));

    const handleSavePassword = async () => {
        const errs = {};
        if (!password)                                errs.password = "La contraseña es requerida";
        else if (passed.length < REQUIREMENTS.length) errs.password = "La contraseña no cumple todos los requisitos";
        if (!confirm)                                 errs.confirm  = "Confirma tu contraseña";
        else if (password !== confirm)                errs.confirm  = "Las contraseñas no coinciden";
        if (Object.keys(errs).length) { setPassErrors(errs); return; }
        try {
            setLoadPass(true);
            await resetPassword(email, savedOtp, password);
            setStep("success");
            setTimeout(onClose, 2500);
        } catch (err) {
            setPassErrors({ password: err.message });
        } finally {
            setLoadPass(false);
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full max-w-[420px] rounded-[22px] px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
                style={{ background: "linear-gradient(145deg,rgba(14,18,62,0.97) 0%,rgba(22,28,80,0.98) 100%)" }}
            >
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white/80 bg-transparent border-0 cursor-pointer transition-colors"
                >
                    <X size={20} />
                </button>

                {/* ── PASO: enviando ── */}
                {step === "sending" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="w-12 h-12 rounded-full border-2 border-[#50E5F9]/30 border-t-[#50E5F9] animate-spin" />
                        <p className="text-white/70 text-[0.88rem] text-center">
                            Enviando código a<br />
                            <span className="text-[#50E5F9] font-semibold">{email}</span>
                        </p>
                    </div>
                )}

                {/* ── PASO: OTP ── */}
                {step === "otp" && (
                    <>
                        <div className="flex justify-center mb-5">
                            <StepRing step={2}><Mail size={28} color="#50E5F9" strokeWidth={1.8} /></StepRing>
                        </div>
                        <h2 className="text-white font-bold text-[1.3rem] text-center mb-1">Validación de código</h2>
                        <p className="text-[rgba(255,255,255,0.6)] text-[0.83rem] text-center mb-1 leading-[1.6]">
                            Hemos enviado un código de 6 dígitos a:
                        </p>
                        <p className="text-[#50E5F9] text-[0.87rem] font-semibold text-center mb-6">{email}</p>

                        <label className="block text-[12px] font-semibold text-white mb-3 text-center">
                            Ingresa el código recibido
                        </label>
                        <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(""); }} />
                        {otpError && <p className="text-red-400 text-[0.78rem] text-center mt-2">{otpError}</p>}

                        <div className="flex items-center justify-center gap-2 mt-4">
                            <Clock size={14} color="rgba(255,255,255,0.5)" />
                            <span className={`text-[0.8rem] ${seconds <= 60 ? "text-red-400" : "text-[rgba(255,255,255,0.5)]"}`}>
                                El código expirará en {mm}:{ss} minutos
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 mt-5">
                            <Button variant="primary" size="md" onClick={handleValidateOtp} disabled={loadOtp}>
                                <CheckCircle2 size={16} className="mr-2" />
                                {loadOtp ? "Validando..." : "Validar código"}
                            </Button>
                            <button onClick={handleResend}
                                className="flex items-center justify-center gap-2 text-[rgba(255,255,255,0.65)] text-[0.83rem] bg-transparent border-0 cursor-pointer hover:text-white transition-colors py-1">
                                <RefreshCw size={14} />
                                {resent ? "¡Código reenviado!" : "Reenviar código"}
                            </button>
                        </div>
                    </>
                )}

                {/* ── PASO: nueva contraseña ── */}
                {step === "password" && (
                    <>
                        <div className="flex justify-center mb-5 relative">
                            <StepRing step={3}><Lock size={28} color="#50E5F9" strokeWidth={1.8} /></StepRing>
                            <div className="absolute bottom-0 right-[calc(50%-52px+4px)] w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center border-2 border-[rgba(14,18,55,0.9)]">
                                <CheckCircle2 size={14} color="#fff" strokeWidth={2.5} />
                            </div>
                        </div>
                        <h2 className="text-white font-bold text-[1.3rem] text-center mb-1">Nueva contraseña</h2>
                        <p className="text-[rgba(255,255,255,0.6)] text-[0.83rem] text-center mb-6 leading-[1.6]">
                            Ingresa tu nueva contraseña para<br />actualizar el acceso a tu cuenta.
                        </p>

                        <div className="relative mb-1">
                            <Input label="Nueva contraseña" type={showPass ? "text" : "password"}
                                placeholder="••••••••••" value={password} labelVariant="light"
                                onChange={(e) => { setPassword(e.target.value); setPassErrors((p) => ({ ...p, password: "" })); }}
                                error={passErrors.password} />
                            <button type="button" onClick={() => setShowPass((v) => !v)}
                                className="absolute right-3 bottom-[14px] bg-transparent border-0 cursor-pointer" tabIndex={-1}>
                                {showPass ? <EyeOff size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
                            </button>
                        </div>

                        <PasswordStrength password={password} />

                        {password.length > 0 && (
                            <div className="bg-[rgba(255,255,255,0.04)] rounded-[10px] px-4 py-3 mb-4">
                                <p className="text-[rgba(255,255,255,0.5)] text-[0.75rem] mb-2">La contraseña debe contener:</p>
                                <ul className="flex flex-col gap-[5px]">
                                    {REQUIREMENTS.map((r) => {
                                        const ok = r.test(password);
                                        return (
                                            <li key={r.key} className="flex items-center gap-2">
                                                <CheckCircle2 size={14} color={ok ? "#22C55E" : "rgba(255,255,255,0.2)"} strokeWidth={2.5} />
                                                <span className={`text-[0.78rem] ${ok ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(255,255,255,0.35)]"}`}>{r.label}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="relative">
                            <Input label="Confirmar contraseña" type={showConf ? "text" : "password"}
                                placeholder="••••••••••" value={confirm} labelVariant="light"
                                onChange={(e) => { setConfirm(e.target.value); setPassErrors((p) => ({ ...p, confirm: "" })); }}
                                error={passErrors.confirm} />
                            <button type="button" onClick={() => setShowConf((v) => !v)}
                                className="absolute right-3 bottom-[14px] bg-transparent border-0 cursor-pointer" tabIndex={-1}>
                                {showConf ? <EyeOff size={16} color="rgba(255,255,255,0.5)" /> : <Eye size={16} color="rgba(255,255,255,0.5)" />}
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <Button variant="primary" size="md" onClick={handleSavePassword} disabled={loadPass}>
                                <Lock size={16} className="mr-2" />
                                {loadPass ? "Guardando..." : "Guardar contraseña"}
                            </Button>
                        </div>
                    </>
                )}

                {/* ── PASO: éxito ── */}
                {step === "success" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E]/40 flex items-center justify-center">
                            <CheckCircle2 size={36} color="#22C55E" strokeWidth={2} />
                        </div>
                        <h2 className="text-white font-bold text-[1.2rem] text-center">¡Contraseña actualizada!</h2>
                        <p className="text-[rgba(255,255,255,0.55)] text-[0.83rem] text-center">
                            Tu contraseña fue cambiada correctamente.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
