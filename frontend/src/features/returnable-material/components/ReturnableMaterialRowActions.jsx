import { useState } from "react";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, alertConfirm, alertSuccess, alertError } from "@/shared";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleReturnableMaterial } from "../services/returnableMaterialService";

export default function ReturnableMaterialRowActions({ material, onToggle }) {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(material.enabled ?? true);

  const handleToggle = async () => {
    const accion = isEnabled ? "deshabilitar" : "habilitar";
    const confirm = await alertConfirm(
      `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} material?`,
      `¿Deseas ${accion} "${material.elementName || material.materialElementName}"?`
    );
    if (!confirm.isConfirmed) return;

    try {
      const result = await toggleReturnableMaterial(material.id || material.returnableMaterialId);
      const nuevoEstado = result.material?.enabled ?? !isEnabled;
      setIsEnabled(nuevoEstado);
      alertSuccess(`Material ${nuevoEstado ? "habilitado" : "deshabilitado"}`, result.message);
      if (onToggle) onToggle();
    } catch (err) {
      alertError("Error", err.message);
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

        <DropdownContent className="right-0 w-48 bg-[#1e1230]">
          <DropdownItem onClick={() => navigate("/dashboard/returnable-material/visualize", { state: { material } })}>
            Visualizar
          </DropdownItem>

          <DropdownItem onClick={() => navigate("/dashboard/returnable-material/edit", { state: { materialId: material.id } })}>
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
