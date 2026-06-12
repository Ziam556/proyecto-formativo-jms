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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">

            {/* Tarjeta del módulo con gradiente */}
            <div className="bg-module-card rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[680px] w-full px-10 py-12">

                {/* Título del módulo */}
                <h2 className="text-white text-center text-[1.3rem] font-bold mb-8">
                    Módulo de material devolutivo
                </h2>

                {/* Grid 2 columnas con los botones de acción */}
                <div className="grid grid-cols-2 gap-4">
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
