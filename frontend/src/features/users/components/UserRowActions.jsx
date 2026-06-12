import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, Button } from "@/shared";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserRowActions({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center">
            <Dropdown>
                <DropdownTrigger>
                    <IconButton ariaLabel="Más opciones">
                        <EllipsisVertical size={16} />
                    </IconButton>
                </DropdownTrigger>

                <DropdownContent className="right-0 w-48">
                    <DropdownItem>
                        <button
                            onClick={() => navigate(`/dashboard/userpage/${user.id}/view`)}
                            className="block w-full text-left"
                        >
                            Visualizar
                        </button>
                    </DropdownItem>
                    <DropdownItem>
                        <button
                            onClick={() => navigate(`/dashboard/userpage/${user.id}/edit`)}
                            className="block w-full text-left"
                        >
                            Editar
                        </button>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>
        </div>
    );
}
