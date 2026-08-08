import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService";
import Swal from "sweetalert2";

const SESSION_KEY = "jms_active_user";
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 horas

function getActiveSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (Date.now() - session.loggedAt > SESSION_TIMEOUT_MS) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

function setActiveSession(email) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedAt: Date.now() }));
}

export default function LoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    // Al montar la página de login o cuando el navegador la restaura desde bfcache,
    // limpiar la sesión para que el botón "adelante" no permita re-entrar sin autenticarse.
    useEffect(() => {
        const clearSession = () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("must_change_password");
            localStorage.removeItem("jms_active_user");
        };

        clearSession(); // limpieza en montaje normal

        // Bug 2 fix — bfcache: el useEffect no se vuelve a ejecutar cuando el navegador
        // restaura la página desde el caché; el evento pageshow sí se dispara.
        const handlePageShow = (e) => { if (e.persisted) clearSession(); };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors({});
        setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fieldErrors = {};
        if (!formData.userEmail.trim())    fieldErrors.userEmail    = "El correo es requerido";
        if (!formData.userPassword.trim()) fieldErrors.userPassword = "La contraseña es requerida";

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        // Verificar si ya hay una sesión activa con el mismo correo
        const activeSession = getActiveSession();
        if (activeSession && activeSession.email === formData.userEmail.trim()) {
            await Swal.fire({
                title: "Sesión ya activa",
                html: `La cuenta <b>${formData.userEmail}</b> ya tiene una sesión abierta en otra ventana o pestaña.<br/><br/>Cierra sesión allí antes de iniciar aquí.`,
                icon: "warning",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#7e22ce",
                background: "#1e1e2e",
                color: "#ffffff",
            });
            return;
        }

        try {
            const data = await login(formData);
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                setActiveSession(formData.userEmail.trim());
            }
            if (data.mustChangePassword) {
                sessionStorage.setItem("must_change_password", "true"); // legacy — la verificación real viene del JWT
                navigate("/auth/change-password", { replace: true }); // replace: no dejar /auth en el historial
            } else {
                navigate("/dashboard/home", { replace: true });
            }
        } catch (error) {
            setServerError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row rounded-[20px] overflow-hidden max-w-[780px] w-full shadow-[0_8px_40px_rgba(0,0,0,0.35)]">

                {/* Panel izquierdo — oculto en móvil muy pequeño */}
                <div className="sm:flex-1 bg-[linear-gradient(160deg,rgba(140,60,160,0.7)_0%,rgba(80,60,160,0.6)_100%)] backdrop-blur-[12px] flex flex-col justify-center items-center px-8 py-8 sm:py-12 text-white text-center">
                    <h2 className="text-[1.4rem] sm:text-[1.6rem] font-bold mb-3">¡Hola!</h2>
                    <p className="text-[0.9rem] sm:text-[0.95rem] opacity-90 leading-[1.7]">
                        Bienvenid@ a<br />nuestro Sistema de<br />inventario
                    </p>
                </div>

                {/* Panel derecho — formulario */}
                <form
                    onSubmit={handleSubmit}
                    className="sm:flex-[1.4] bg-[linear-gradient(160deg,rgba(180,190,220,0.55)_0%,rgba(160,190,220,0.45)_100%)] backdrop-blur-[16px] flex flex-col justify-center px-6 sm:px-10 py-8 sm:py-12 gap-4"
                >
                    {/* Email */}
                    <div className="flex items-center gap-[10px] bg-[rgba(220,225,240,0.55)] rounded-[10px] px-4 py-[14px] border border-white/50">
                        <User size={18} color="#222" strokeWidth={2.2} />
                        <input
                            className="flex-1 bg-transparent border-0 outline-none text-[0.95rem] font-semibold text-[#2a2a4a] placeholder:font-semibold placeholder:text-[#2a2a4a]"
                            type="email"
                            name="userEmail"
                            placeholder="Correo electrónico"
                            value={formData.userEmail}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="flex items-center gap-[10px] bg-[rgba(220,225,240,0.55)] rounded-[10px] px-4 py-[14px] border border-white/50">
                        <Lock size={18} color="#222" strokeWidth={2.2} />
                        <input
                            className="flex-1 bg-transparent border-0 outline-none text-[0.95rem] font-semibold text-[#2a2a4a] placeholder:font-semibold placeholder:text-[#2a2a4a]"
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
                            {showPassword ? <EyeOff size={18} color="#222" strokeWidth={2.2} /> : <Eye size={18} color="#222" strokeWidth={2.2} />}
                        </button>
                    </div>

                    {errors.userEmail && (
                        <p className="text-red-500 text-[0.85rem] text-center m-0">{errors.userEmail}</p>
                    )}
                    {errors.userPassword && (
                        <p className="text-red-500 text-[0.85rem] text-center m-0">{errors.userPassword}</p>
                    )}
                    {serverError && (
                        <p className="text-red-500 text-[0.85rem] text-center m-0">{serverError}</p>
                    )}

                    {/* Olvidé contraseña */}
                    <p
                        onClick={() => navigate("/auth/forgot-password")}
                        className="text-center text-[0.85rem] font-semibold text-white cursor-pointer m-0 hover:underline"
                    >
                        ¡Olvidé mi contraseña!
                    </p>

                    {/* Soporte */}
                    <p className="text-center text-[0.78rem] text-[#2a2a4a] font-semibold m-0">
                        ¿No tienes cuenta? Contacta a soporte:{" "}
                        <a
                            href="https://mail.google.com/mail/?view=cm&to=sc876858@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:opacity-75"
                        >
                            sc876858@gmail.com
                        </a>
                    </p>

                    {/* Botón */}
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