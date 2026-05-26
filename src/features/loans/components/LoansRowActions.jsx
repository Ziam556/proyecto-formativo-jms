import {
  IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem,
} from "@/shared";
import { Link } from "react-router-dom";
import { Pencil, EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoansRowActions({ loan }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/dashboard/loans/${loan.id}/edit`);
  };

  const handleDevolver = () => {
    navigate(`/dashboard/loans/${loan.id}/return`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100">
        <Pencil size={16} />
      </button>

      <button className="p-1 rounded hover:bg-gray-100">
        <Dropdown>
          <DropdownTrigger>
            <IconButton ariaLabel="Más opciones">
              <EllipsisVertical size={16} />
            </IconButton>
          </DropdownTrigger>

          <DropdownContent className="right-0 w-48">
            <DropdownItem>
              <Link
                to={`/dashboard/loans/${loan.id}/edit`}
                className="block w-full"
              >
                Editar
              </Link>
            </DropdownItem>

            <DropdownItem>
              <button
                className="block w-full text-left"
                onClick={handleDevolver}
              >
                ↩ Devolver
              </button>
            </DropdownItem>

            <DropdownItem>
              <button
                className="block w-full text-left"
                onClick={() => console.log("Dar de baja:", loan.id)}
              >
                Dar de baja
              </button>
            </DropdownItem>

            <DropdownItem>
              <button
                className="block w-full text-left"
                onClick={() => console.log("Ver ficha:", loan.id)}
              >
                Ver ficha técnica
              </button>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </button>
    </div>
  );
}