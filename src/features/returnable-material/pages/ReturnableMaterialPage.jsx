import { useNavigate } from "react-router-dom";
import { Plus, Pencil, List, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

// Acciones disponibles dentro del módulo de material devolutivo
const menuItems = [
    { label: "Crear", icon: Plus, to: "/dashboard/returnable-material/create" },
    { label: "Editar", icon: Pencil, to: "/dashboard/returnable-material/edit" },
    { label: "Listar", icon: List, to: "/dashboard/returnable-material/list" },
    { label: "Habilitar / Deshabilitar", icon: EyeOff, to: "/dashboard/returnable-material/toggle" },
    { label: "Visualizar", icon: Eye, to: "/dashboard/returnable-material/visualize" },
];

export default function ReturnableMaterialPage() {
    const navigate = useNavigate();

    return (
        /* Centra la tarjeta verticalmente en el espacio disponible */
        <div style={{
            minHeight: "calc(100vh - 64px)", // resta el navbar
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>

            {/* Tarjeta del módulo con gradiente */}
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

                {/* Título del módulo */}
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: "1.3rem", fontWeight: 700, marginBottom: "32px" }}>
                    Módulo de material devolutivo
                </h2>

                {/* Grid 2 columnas con los botones de acción */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {menuItems.map((item) => (
                        <MenuButton key={item.to} label={item.label} icon={item.icon} to={item.to} />
                    ))}

                    {/* Vuelve al home */}
                    <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                </div>

            </div>
        </div>
    );
}
