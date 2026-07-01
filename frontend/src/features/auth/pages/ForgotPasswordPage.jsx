import { useState } from "react";
import ForgotPasswordPage1 from "./ForgotPasswordPage1";
import ForgotPasswordPage2 from "./ForgotPasswordPage2";
import ForgotPasswordPage3 from "./ForgotPasswordPage3";

export default function ForgotPasswordPage() {
    const [step, setStep]   = useState(1);
    const [email, setEmail] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div
                className="w-full max-w-[420px] rounded-[22px] px-6 py-8 shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
                style={{
                    background: "linear-gradient(145deg, rgba(14,18,62,0.92) 0%, rgba(22,28,80,0.95) 100%)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {step === 1 && (
                    <ForgotPasswordPage1 onNext={(e) => { setEmail(e); setStep(2); }} />
                )}
                {step === 2 && (
                    <ForgotPasswordPage2 email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />
                )}
                {step === 3 && (
                    <ForgotPasswordPage3 onBack={() => setStep(2)} />
                )}
            </div>
        </div>
    );
}
