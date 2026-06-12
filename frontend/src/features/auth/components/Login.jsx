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

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="flex rounded-[20px] overflow-hidden max-w-[780px] w-full min-h-[380px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">

                {/* Panel izquierdo */}
                <div className="flex-1 bg-[linear-gradient(160deg,rgba(140,60,160,0.7)_0%,rgba(80,60,160,0.6)_100%)] backdrop-blur-[12px] flex flex-col justify-center items-center px-8 py-12 text-white text-center">
                    <h2 className="text-[1.6rem] font-bold mb-3">
                        ¡Hola!
                    </h2>
                    <p className="text-[0.95rem] opacity-90 leading-[1.7]">
                        Bienvenid@ a<br />nuestro Sistema de<br />inventario
                    </p>
                </div>

                {/* Panel derecho — formulario */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-[1.4] bg-[linear-gradient(160deg,rgba(180,190,220,0.55)_0%,rgba(160,190,220,0.45)_100%)] backdrop-blur-[16px] flex flex-col justify-center px-10 py-12 gap-4"
                >
                    {/* Email */}
                    <div className="flex items-center gap-[10px] bg-[rgba(220,225,240,0.55)] rounded-[10px] px-4 py-[14px] border border-white/50">
                        <User size={18} color="#555" />
                        <input
                            className="flex-1 bg-transparent border-0 outline-none text-[0.95rem] text-[#2a2a4a]"
                            type="email"
                            name="userEmail"
                            placeholder="Correo electrónico"
                            value={formData.userEmail}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="flex items-center gap-[10px] bg-[rgba(220,225,240,0.55)] rounded-[10px] px-4 py-[14px] border border-white/50">
                        <Lock size={18} color="#555" />
                        <input
                            className="flex-1 bg-transparent border-0 outline-none text-[0.95rem] text-[#2a2a4a]"
                            type={showPassword ? "text" : "password"}
                            name="userPassword"
                            placeholder="Contraseña"
                            value={formData.userPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="bg-transparent border-0 cursor-pointer flex"
                        >
                            {showPassword
                                ? <EyeOff size={18} color="#555" />
                                : <Eye size={18} color="#555" />
                            }
                        </button>
                    </div>

                    {/* Olvidé contraseña */}
                    <p className="text-center text-[0.85rem] text-[#8b3a8b] cursor-pointer m-0">
                        ¡Olvidé mi contraseña!
                    </p>

                    {/* Botón — hover con Tailwind */}
                    <button
                        type="submit"
                        className="bg-[linear-gradient(90deg,#9b2d8a,#7b2080)] text-white border-0 rounded-full py-[14px] text-[1rem] font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-[0.88]"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}