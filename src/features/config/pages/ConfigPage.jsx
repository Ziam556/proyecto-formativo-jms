import { useNavigate } from "react-router-dom"
import { Cylinder, Users, FileSliders, ArrowLeft  } from "lucide-react"
import { MenuButton } from "@/shared";

// Secciones de configuración del sistema
const menuItems = [
    { label: "Marcas", icon: Cylinder, to: "/dashboard/config/brands" },
    { label: "Grupos", icon: Users, to: "/dashboard/config/groups" },
    { label: "Gestión de tareas", icon: FileSliders },
];

export default function ConfigPage() {
    const navigate = useNavigate();

    return (
        /* Centra la tarjeta en pantalla */
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">

            {/* Tarjeta con gradiente, igual que el home */}
            <div className="bg-module-card flex rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[720px] w-full min-h-[320px]">

                {/* Lado izquierdo — texto de bienvenida */}
                <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 text-white text-center border-r border-white/15">
                    <h2 className="text-[1.5rem] font-bold mb-3">
                        ¡Hola!
                    </h2>
                    <p className="text-[0.95rem] opacity-85 leading-relaxed">
                        Bienvenido a<br />nuestra<br />configuración.
                    </p>
                </div>

                {/* Lado derecho — opciones de configuración */}
                <div className="flex-1 flex flex-col gap-3 justify-center px-8 py-10">
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
