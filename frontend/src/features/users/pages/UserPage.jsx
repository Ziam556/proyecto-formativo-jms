import { useNavigate } from "react-router-dom";
import { Plus, Pencil, List, Eye, ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

// Acciones disponibles dentro del módulo de usuarios
const menuItems = [
    { label: "Crear",      icon: Plus,   to: "/dashboard/userpage/create"    },
    { label: "Editar",     icon: Pencil, to: "/dashboard/userpage/edit"      },
    { label: "Listar",     icon: List,   to: "/dashboard/userpage/list"      },
    { label: "Visualizar", icon: Eye,    to: "/dashboard/userpage/visualize" },
];

export default function UserPage() {
    const navigate = useNavigate();

    return (
        /* Centra la tarjeta verticalmente en el espacio disponible */
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">

            {/* Tarjeta del módulo con gradiente */}
            <div className="bg-module-card rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[680px] w-full px-6 sm:px-10 py-8 sm:py-12">

                {/* Título del módulo */}
                <h2 className="text-white text-center text-[1.1rem] sm:text-[1.3rem] font-bold mb-6 sm:mb-8">
                    Módulo de usuarios
                </h2>

                {/* Grid — 1 col en móvil, 2 en tablet+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menuItems.map((item) => (
                        <MenuButton key={item.to} label={item.label} icon={item.icon} to={item.to} />
                    ))}

                    {/* Vuelve al home — centrado igual que en materiales */}
                    <div className="sm:col-span-2 flex justify-center">
                        <MenuButton label="Regresar" className="w-full sm:w-70" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                    </div>
                </div>

            </div>
        </div>
    );
}
