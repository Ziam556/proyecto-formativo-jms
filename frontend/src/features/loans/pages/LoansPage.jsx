import { useNavigate } from "react-router-dom";

import {
  Plus,
  Pencil,
  List,
  Eye,
  ArrowLeft,
} from "lucide-react";

import { MenuButton } from "@/shared";

const menuItems = [
  {
    label: "Crear",
    icon: Plus,
    to: "/dashboard/loans/create",
  },

  {
    label: "Editar",
    icon: Pencil,
    to: "/dashboard/loans/edit",
  },

  {
    label: "Visualizar",
    icon: Eye,
    to: "/dashboard/loans/visualize",
  },

  {
    label: "Prestamos Activos",
    icon: List,
    to: "/dashboard/loans/list",
  },
];

export default function LoansPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6">

      {/* CONTENEDOR */}
      <div className="rounded-[20px] overflow-hidden bg-gradient-to-r from-[#700D7C] via-[#88A3C7] to-[#50E5F9] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[680px] w-full px-6 sm:px-10 py-8 sm:py-12">

        {/* TITULO */}
        <h2 className="text-white text-center text-[1.1rem] sm:text-[1.3rem] font-bold mb-6 sm:mb-8">
          Módulo de Prestamo
        </h2>

        {/* BOTONES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {menuItems.map((item) => (
            <MenuButton
              key={item.to}
              label={item.label}
              icon={item.icon}
              to={item.to}
            />
          ))}

          {/* REGRESAR */}
          <MenuButton
            label="Regresar"
            icon={ArrowLeft}
            onClick={() => navigate("/dashboard/home")}
            className="sm:col-span-2 sm:w-1/2 sm:mx-auto"
          />
        </div>
      </div>
    </div>
  );
}