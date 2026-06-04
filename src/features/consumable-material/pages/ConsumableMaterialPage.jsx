import { useNavigate } from "react-router-dom";
import { Plus, Pencil, List, Eye, ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

const menuItems = [
  { label: "Crear", icon: Plus, to: "/dashboard/consumable-material/create" },
  { label: "Editar", icon: Pencil, to: "/dashboard/consumable-material/edit" },
  { label: "Listar", icon: List, to: "/dashboard/consumable-material/list" },
  { label: "Visualizar", icon: Eye, to: "/dashboard/consumable-material/visualize" },
];

export default function ConsumableMaterialPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-[680px] rounded-[20px] overflow-hidden bg-gradient-to-r from-[#700D7C] via-[#88A3C7] to-[#50E5F9] shadow-2xl backdrop-blur-md px-10 py-12">

        <h2 className="text-white text-center text-xl font-bold mb-8">
          Módulo de material consumo
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuButton
              key={item.to}
              label={item.label}
              icon={item.icon}
              to={item.to}
            />
          ))}

          <div className="col-span-2 flex justify-center">
            <MenuButton
              label="Regresar"
              className="w-70"
              icon={ArrowLeft}
              onClick={() => navigate("/dashboard/home")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}