import { useNavigate } from "react-router-dom"
import { Cylinder, Users, FileSliders, ArrowLeft, UserRoundKey } from "lucide-react"
import { MenuButton } from "@/shared";

const menuItems = [
    { label: "Marcas", icon: Cylinder, to: "/dashboard/config/brands" },
    { label: "Grupos", icon: Users, to: "/dashboard/config/groups" },
    { label: "Permisos", icon: UserRoundKey, to: "/dashboard/config/permissions" },
    { label: "Gestión de tareas", icon: FileSliders, to: "/dashboard/config/tasks" },
];

export default function ConfigPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-full flex items-center justify-center p-6">
            <div className="bg-module-card flex flex-col sm:flex-row rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[720px] w-full min-h-[320px]">

                {/* Lado izquierdo */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 py-8 sm:py-12 text-white text-center sm:border-r sm:border-b-0 border-b border-white/15">
                    <h2 className="text-[1.5rem] font-bold mb-3">
                        ¡Hola!
                    </h2>
                    <p className="text-[0.95rem] opacity-85 leading-relaxed">
                        Bienvenido a<br />nuestra<br />configuración.
                    </p>
                </div>

                {/* Lado derecho */}
                <div className="flex-1 flex flex-col gap-3 justify-center px-6 sm:px-8 py-8 sm:py-10">
                    {menuItems.map((item) => (
                        <MenuButton key={item.label} {...item} />
                    ))}
                    <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                </div>

            </div>
        </div>
    );
}
