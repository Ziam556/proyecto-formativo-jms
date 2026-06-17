import { useNavigate } from "react-router-dom";
import { Users, Package, ShoppingCart, Handshake, ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

// Opciones del menú principal — cada item lleva a un módulo del sistema
const menuItems = [
  { label: "Gestion de Usuarios", icon: Users, to: "/dashboard/userpage" },
  { label: "Material Devolutivo", icon: Package, to: "/dashboard/returnable-material" },
  { label: "Material Consumo", icon: ShoppingCart, to: "/dashboard/consumable-material" },
  { label: "Prestamo", icon: Handshake, to: "/dashboard/loans" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    /* Contenedor principal — ocupa el alto disponible y centra la tarjeta */
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">

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

          {/* Vuelve al login */}
          <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/auth")} />
        </div>

      </div>
    </div>
  );
}
