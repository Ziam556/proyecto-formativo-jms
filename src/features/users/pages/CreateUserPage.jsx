import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserRegisterForm from "../components/UserRegisterForm";

export default function CreateUserPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            padding: "24px 40px",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* Título */}
            <h1 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
                Registro de usuario
            </h1>

            {/* Contenedor exterior glass */}
            <div style={{
                width: "95%",
                margin: "0 auto",
                borderRadius: "16px",
                background: "rgba(217,217,217,0.31)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "48px 40px 40px",
            }}>
                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/userpage")}
                    style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        zIndex: 1,
                    }}
                    title="Regresar"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Contenedor interior glass blanco */}
                <div style={{
                    width: "100%",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.31)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "36px 48px",
                    overflowX: "auto",
                }}>
                    <UserRegisterForm onCancel={() => navigate("/dashboard/userpage")} />
                </div>
            </div>
        </div>
    );
}
