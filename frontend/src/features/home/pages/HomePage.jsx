import { useNavigate } from "react-router-dom";
import { Users, Package, ShoppingCart, Handshake, FileText, ArrowLeft } from "lucide-react";
import { MenuButton, usePermissions } from "@/shared";
import { handleLogout } from "@/features/auth/services/logoutService";

// Módulos disponibles — aparece si el usuario tiene CUALQUIER permiso del módulo
const ALL_MODULES = [
  {
    label: "Gestión de usuarios", icon: Users, to: "/dashboard/userpage",
    permission: ["list_user", "create_user", "edit_user", "toggle_user", "report_user"],
  },
  {
    label: "Material Devolutivo", icon: Package, to: "/dashboard/returnable-material",
    permission: ["list_returnable", "create_returnable", "edit_returnable", "view_returnable", "toggle_returnable", "report_returnable", "return_returnable"],
  },
  {
    label: "Material de Consumo", icon: ShoppingCart, to: "/dashboard/consumable-material",
    permission: ["list_consumable", "create_consumable", "edit_consumable", "view_consumable", "toggle_consumable", "report_consumable", "return_consumable"],
  },
  {
    label: "Préstamo", icon: Handshake, to: "/dashboard/loans",
    permission: ["list_loan", "create_loan", "edit_loan", "view_loan", "report_loan", "return_returnable"],
  },
  {
    label: "Cotizaciones", icon: FileText, to: "/dashboard/quotations",
    permission: null, // visible para todos los usuarios autenticados
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Siempre mostrar todos los módulos; el router bloquea el acceso si no hay permiso
  const menuItems = ALL_MODULES;

  return (
    /* Contenedor principal — ocupa el alto disponible y centra la tarjeta */
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6">

      {/* Tarjeta principal con gradiente y efecto blur */}
      <div className="bg-module-card flex flex-col sm:flex-row rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[720px] w-full">

        {/* Lado izquierdo — mensaje de bienvenida */}
        <div className="sm:flex-1 flex flex-col justify-center items-center px-8 py-8 sm:py-12 text-white text-center sm:border-r sm:border-b-0 border-b border-white/15">
          <h2 className="text-[1.3rem] sm:text-[1.5rem] font-bold mb-3">
            ¡Hola!
          </h2>
          <p className="text-[0.9rem] sm:text-[0.95rem] opacity-85 leading-relaxed">
            Bienvenido a<br />nuestro sistema de<br />inventario.
          </p>
        </div>

        {/* Lado derecho — botones de navegación */}
        <div className="sm:flex-1 flex flex-col gap-3 justify-center px-6 sm:px-8 py-6 sm:py-10">
          {/* Módulos disponibles */}
          {menuItems.map((item) => (
            <MenuButton key={item.to} {...item} />
          ))}

          {/* Cerrar sesión con confirmación */}
          <MenuButton label="Cerrar sesión" icon={ArrowLeft} onClick={() => handleLogout(navigate)} />
        </div>

      </div>
    </div>
  );
}
