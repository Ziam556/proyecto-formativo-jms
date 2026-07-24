import { useState } from "react";
import {
  IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem,
  alertConfirm, alertSuccess, alertError,
} from "@/shared";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleConsumableMaterial } from "../services/consumableMaterialService";

export default function ConsumableMaterialRowActions({ material, onToggle }) {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(material.enabled ?? true);

  const handleToggle = async () => {
    const action = isEnabled ? "deshabilitar" : "habilitar";
    const confirmed = await alertConfirm(
      `¿${action.charAt(0).toUpperCase() + action.slice(1)} material?`,
      `¿Deseas ${action} "${material.elementName}"?`
    );
    if (!confirmed.isConfirmed) return;

    try {
      await toggleConsumableMaterial(material.id, !isEnabled);
      setIsEnabled((prev) => !prev);
      alertSuccess("Estado actualizado", `Material ${!isEnabled ? "habilitado" : "deshabilitado"} correctamente.`);
      if (onToggle) onToggle();
    } catch (err) {
      alertError("Error", err.message || "No se pudo cambiar el estado.");
    }
  };

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

          <DropdownItem onClick={() => navigate("/dashboard/consumable-material/edit", { state: { materialId: material.id } })}>
            Editar
          </DropdownItem>

          <DropdownItem onClick={handleToggle}>
            {isEnabled ? "Deshabilitar" : "Habilitar"}
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}