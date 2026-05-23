import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/dashboard/home");
    };

    const inputWrapper = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(220, 225, 240, 0.55)",
        borderRadius: "10px",
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.5)",
    };

    const inputStyle = {
        flex: 1,
        background: "transparent",
        border: "none",
        outline: "none",
        fontSize: "0.95rem",
        color: "#2a2a4a",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    borderRadius: "20px",
                    overflow: "hidden",
                    maxWidth: "780px",
                    width: "100%",
                    minHeight: "380px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
                }}
            >
                {/* Panel izquierdo */}
                <div
                    style={{
                        flex: 1,
                        background: "linear-gradient(160deg, rgba(140,60,160,0.7) 0%, rgba(80,60,160,0.6) 100%)",
                        backdropFilter: "blur(12px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "48px 32px",
                        color: "#fff",
                        textAlign: "center",
                    }}
                >
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "12px" }}>
                        ¡Hola!
                    </h2>
                    <p style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.7 }}>
                        Bienvenid@ a<br />nuestro Sistema de<br />inventario
                    </p>
                </div>

                {/* Panel derecho — formulario */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        flex: 1.4,
                        background: "linear-gradient(160deg, rgba(180,190,220,0.55) 0%, rgba(160,190,220,0.45) 100%)",
                        backdropFilter: "blur(16px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "48px 40px",
                        gap: "16px",
                    }}
                >
                    {/* Email */}
                    <div style={inputWrapper}>
                        <User size={18} color="#555" />
                        <input
                            style={inputStyle}
                            type="email"
                            name="userEmail"
                            placeholder="Correo electrónico"
                            value={formData.userEmail}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Contraseña */}
                    <div style={inputWrapper}>
                        <Lock size={18} color="#555" />
                        <input
                            style={inputStyle}
                            type={showPassword ? "text" : "password"}
                            name="userPassword"
                            placeholder="Contraseña"
                            value={formData.userPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                        >
                            {showPassword
                                ? <EyeOff size={18} color="#555" />
                                : <Eye size={18} color="#555" />
                            }
                        </button>
                    </div>

                    {/* Olvidé contraseña */}
                    <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#8b3a8b", cursor: "pointer", margin: 0 }}>
                        ¡Olvidé mi contraseña!
                    </p>

                    {/* Botón */}
                    <button
                        type="submit"
                        style={{
                            background: "linear-gradient(90deg, #9b2d8a, #7b2080)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "999px",
                            padding: "14px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}