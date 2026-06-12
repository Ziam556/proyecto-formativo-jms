import {
  IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem,
} from "@/shared";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConsumableMaterialRowActions({ material }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <IconButton ariaLabel="Más opciones">
            <EllipsisVertical size={16} />
          </IconButton>
        </DropdownTrigger>

        <DropdownContent className="right-0 w-44 bg-[#1e1230]">
          <DropdownItem onClick={() => navigate("/dashboard/consumable-material/visualize", { state: { material } })}>
            Visualizar
          </DropdownItem>

          <DropdownItem onClick={() => navigate("/dashboard/consumable-material/edit")}>
            Editar
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}