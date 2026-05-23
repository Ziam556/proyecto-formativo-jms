import { useNavigate } from "react-router-dom"
import { Cylinder, Users, FileSliders, ArrowLeft  } from "lucide-react"
import { MenuButton } from "@/shared";

// Secciones de configuración del sistema
const menuItems = [
    { label: "Marcas", icon: Cylinder },
    { label: "Grupos", icon: Users, to: "/dashboard/config/groups" },
    { label: "Gestión de tareas", icon: FileSliders },
];

export default function ConfigPage() {
    const navigate = useNavigate();

    return (
        /* Centra la tarjeta en pantalla */
        <div style={{
            minHeight: "calc(100vh - 64px)", // resta el navbar
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>

            {/* Tarjeta con gradiente, igual que el home */}
            <div style={{
                display: "flex",
                borderRadius: "20px",
                overflow: "hidden",
                background: "linear-gradient(90deg, #700D7C 0%, #88A3C7 35%, #50E5F9 100%)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                maxWidth: "720px",
                width: "100%",
                minHeight: "320px",
            }}>

                {/* Lado izquierdo — texto de bienvenida */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "48px 32px",
                    color: "#fff",
                    textAlign: "center",
                    borderRight: "1px solid rgba(255,255,255,0.15)", // separador sutil
                }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>
                        ¡Hola!
                    </h2>
                    <p style={{ fontSize: "0.95rem", opacity: 0.85, lineHeight: 1.6 }}>
                        Bienvenido a<br />nuestra<br />configuración.
                    </p>
                </div>

                {/* Lado derecho — opciones de configuración */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    justifyContent: "center",
                    padding: "40px 32px",
                }}>
                    {/* Secciones disponibles */}
                    {menuItems.map((item) => (
                        <MenuButton key={item.label} {...item} />
                    ))}

                    {/* Vuelve al home */}
                    <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                </div>

            </div>
        </div>
    );
}
