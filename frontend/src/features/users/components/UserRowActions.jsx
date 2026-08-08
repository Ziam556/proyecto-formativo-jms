import { useState } from "react";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, alertConfirm, alertSuccess, alertError } from "@/shared";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleUser } from "../services/userService";

export default function UserRowActions({ user, onRefresh }) {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(user.enabled ?? true);

  const handleToggle = async () => {
    const targetEnabled = !isEnabled;

    // Modo individual
    const accion = isEnabled ? "deshabilitar" : "habilitar";
    const confirm = await alertConfirm(
      `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      `¿Deseas ${accion} a "${user.name}"?`
    );
    if (!confirm.isConfirmed) return;

    try {
      const result = await toggleUser(user.document);
      setIsEnabled(result.enabled);
      alertSuccess(
        `Usuario ${result.enabled ? "habilitado" : "deshabilitado"}`,
        `${user.name} fue ${result.enabled ? "habilitado" : "deshabilitado"} correctamente.`
      );
      if (onRefresh) onRefresh();
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

        <DropdownContent className="right-0 w-44 bg-[#1e1230]">
          <DropdownItem onClick={() => navigate(`/dashboard/userpage/${user.id}/view`, { state: { user } })}>
            Visualizar
          </DropdownItem>

          <DropdownItem onClick={() => navigate("/dashboard/userpage/edit", { state: { user } })}>
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
