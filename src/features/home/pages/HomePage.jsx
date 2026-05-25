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
    <div style={{
      minHeight: "calc(100vh - 64px)", // resta el navbar
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>

      {/* Tarjeta principal con gradiente y efecto blur */}
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

        {/* Lado izquierdo — mensaje de bienvenida */}
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
            Bienvenido a<br />nuestro sistema de<br />inventario.
          </p>
        </div>

        {/* Lado derecho — botones de navegación */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          justifyContent: "center",
          padding: "40px 32px",
        }}>
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
