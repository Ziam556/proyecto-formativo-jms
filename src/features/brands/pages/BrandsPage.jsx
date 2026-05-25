import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

export default function BrandsPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            <div style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "linear-gradient(90deg, #700D7C 0%, #88A3C7 35%, #50E5F9 100%)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                maxWidth: "680px",
                width: "100%",
                padding: "48px 40px",
            }}>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: "1.3rem", fontWeight: 700, marginBottom: "32px" }}>
                    Módulo de marcas
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                </div>
            </div>
        </div>
    );
}
