import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button, Input } from "@/shared";
import { changeFirstPassword } from "../services/authService";

// ─── Requisitos de contraseña ─────────────────────────────────────────────────
const REQUIREMENTS = [
    { key: "length",  label: "Al menos 10 caracteres",           test: (p) => p.length >= 10 },
    { key: "upper",   label: "Una letra mayúscula",               test: (p) => /[A-Z]/.test(p) },
    { key: "lower",   label: "Una letra minúscula",               test: (p) => /[a-z]/.test(p) },
    { key: "number",  label: "Un número",                         test: (p) => /\d/.test(p) },
    { key: "special", label: "Un carácter especial (ej. !@#$%)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

const STRENGTH_COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E"];
const STRENGTH_LABELS = ["Muy débil", "Débil", "Moderada", "Fuerte"];

function PasswordStrength({ password }) {
    if (!password) return null;
    const passed   = REQUIREMENTS.filter((r) => r.test(password)).length;
    const strength = Math.min(4, Math.ceil(passed * 4 / 5));
    const color    = STRENGTH_COLORS[strength - 1] || "#374151";
    return (
        <div className="mt-2 mb-1">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex-1 h-[4px] rounded-full transition-colors duration-300"
                        style={{ backgroundColor: i <= strength ? color : "rgba(255,255,255,0.12)" }}
                    />
                ))}
            </div>
            <p className="text-right text-[0.75rem] font-semibold" style={{ color }}>
                {STRENGTH_LABELS[strength - 1] || ""}
            </p>
        </div>
    );
}

export default function ForceChangePasswordPage() {
    const navigate                = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm]   = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);

    const passed = REQUIREMENTS.filter((r) => r.test(password));

    const handleSave = async () => {
        const errs = {};
        if (!password)                                errs.password = "La contraseña es requerida";
        else if (passed.length < REQUIREMENTS.length) errs.password = "La contraseña no cumple todos los requisitos";
        if (!confirm)                                 errs.confirm  = "Confirma tu contraseña";
        else if (password !== confirm)                errs.confirm  = "Las contraseñas no coinciden";
        if (Object.keys(errs).length) { setErrors(errs); return; }

        try {
            setLoading(true);
            await changeFirstPassword(password);
            sessionStorage.removeItem("must_change_password");
            setSuccess(true);
            setTimeout(() => navigate("/dashboard/home"), 2000);
        } catch (err) {
            setErrors({ password: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div
                className="w-full max-w-[420px] rounded-[22px] px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.5)] flex flex-col"
                style={{
                    background: "linear-gradient(145deg, rgba(14,18,62,0.92) 0%, rgba(22,28,80,0.95) 100%)",
                    backdropFilter: "blur(20px)",
                }}
            >

                {/* Ícono */}
                <div className="flex justify-center mb-5">
                    <div className="w-[72px] h-[72px] rounded-full bg-[rgba(255,200,0,0.1)] border-2 border-[rgba(255,200,0,0.35)] flex items-center justify-center">
                        <ShieldAlert size={34} color="#FCD34D" strokeWidth={1.7} />
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-white font-bold text-[1.3rem] text-center mb-2">
                    Cambia tu contraseña
                </h2>
                <p className="text-[rgba(255,255,255,0.55)] text-[0.83rem] text-center mb-7 leading-[1.6]">
                    Por seguridad, debes establecer una contraseña personal antes de continuar. Esta acción solo se requiere la primera vez.
                </p>

                {/* Nueva contraseña */}
                <div className="relative mb-1">
                    <Input
                        label="Nueva contraseña"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                        error={errors.password}
                        labelVariant="light"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 bottom-[14px] bg-transparent border-0 cursor-pointer"
                        tabIndex={-1}
                    >
                        {showPass
                            ? <EyeOff size={16} color="rgba(255,255,255,0.5)" />
                            : <Eye    size={16} color="rgba(255,255,255,0.5)" />}
                    </button>
                </div>

                <PasswordStrength password={password} />

                {/* Checklist */}
                {password.length > 0 && (
                    <div className="bg-[rgba(255,255,255,0.04)] rounded-[10px] px-4 py-3 mb-4">
                        <p className="text-[rgba(255,255,255,0.5)] text-[0.75rem] mb-2">
                            La contraseña debe contener:
                        </p>
                        <ul className="flex flex-col gap-[5px]">
                            {REQUIREMENTS.map((r) => {
                                const ok = r.test(password);
                                return (
                                    <li key={r.key} className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={14}
                                            color={ok ? "#22C55E" : "rgba(255,255,255,0.2)"}
                                            strokeWidth={2.5}
                                        />
                                        <span className={`text-[0.78rem] ${ok ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(255,255,255,0.35)]"}`}>
                                            {r.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Confirmar */}
                <div className="relative mb-6">
                    <Input
                        label="Confirmar nueva contraseña"
                        type={showConf ? "text" : "password"}
                        placeholder="••••••••••"
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                        error={errors.confirm}
                        labelVariant="light"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConf((v) => !v)}
                        className="absolute right-3 bottom-[14px] bg-transparent border-0 cursor-pointer"
                        tabIndex={-1}
                    >
                        {showConf
                            ? <EyeOff size={16} color="rgba(255,255,255,0.5)" />
                            : <Eye    size={16} color="rgba(255,255,255,0.5)" />}
                    </button>
                </div>

                <Button variant="primary" size="md" onClick={handleSave} disabled={success || loading}>
                    <Lock size={16} className="mr-2" />
                    {loading ? "Guardando..." : success ? "¡Listo! Redirigiendo..." : "Guardar contraseña"}
                </Button>

                {/* Banner éxito */}
                {success && (
                    <div className="flex items-center gap-3 mt-5 bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] rounded-[12px] px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={18} color="#fff" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[#22C55E] font-bold text-[0.87rem]">¡Contraseña actualizada!</p>
                            <p className="text-[rgba(255,255,255,0.55)] text-[0.77rem]">
                                Accediendo al sistema...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
