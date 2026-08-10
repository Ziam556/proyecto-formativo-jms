import { useNavigate } from "react-router-dom"
import { Cylinder, Users, FileSliders, ArrowLeft, Tag, Archive } from "lucide-react"
import { MenuButton, usePermissions } from "@/shared";

const BRAND_PERMS     = ["list_brand",     "create_brand",     "edit_brand",     "toggle_brand",     "delete_brand"    ];
const CATEGORY_PERMS  = ["list_category",  "create_category",  "edit_category",  "toggle_category",  "delete_category" ];
const INVENTORY_PERMS = ["list_inventory", "create_inventory", "edit_inventory", "toggle_inventory", "delete_inventory"];
const GROUP_PERMS     = ["list_group",     "create_group",     "edit_group",     "toggle_group",     "delete_group",     "add_users_group"];
const TASK_PERMS      = ["list_task",      "create_task",      "view_task",      "complete_task",    "verify_task",      "delete_task"    ];

export default function ConfigPage() {
    const navigate = useNavigate();
    const { isAdmin, hasPermission } = usePermissions();

    const menuItems = [
        hasPermission(BRAND_PERMS)                         && { label: "Marcas",           icon: Cylinder,    to: "/dashboard/config/brands"      },
        (isAdmin || hasPermission(CATEGORY_PERMS))         && { label: "Categorías",        icon: Tag,         to: "/dashboard/config/categories"  },
        (isAdmin || hasPermission(INVENTORY_PERMS))        && { label: "Inventarios",       icon: Archive,     to: "/dashboard/config/inventories" },
        (isAdmin || hasPermission(GROUP_PERMS))            && { label: "Grupos",            icon: Users,       to: "/dashboard/config/groups"      },
        (isAdmin || hasPermission(TASK_PERMS))             && { label: "Gestión de tareas", icon: FileSliders, to: "/dashboard/config/tasks"       },
    ].filter(Boolean);

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
