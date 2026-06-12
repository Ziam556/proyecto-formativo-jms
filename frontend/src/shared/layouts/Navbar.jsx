import { Link, useNavigate } from "react-router-dom";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import logo from "@/assets/images/logo-1.png";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="w-full bg-[linear-gradient(90deg,#5b2d8e_0%,#3a6ea8_100%)] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between h-[72px] px-8">

                {/* Logo + título */}
                <Link
                    to="/dashboard/home"
                    className="flex items-center gap-[14px] no-underline text-white"
                >
                    <img src={logo} alt="SENA" className="h-11" />
                    <span className="font-semibold text-[1.15rem] tracking-[0.01em]">
                        Inventario Teleinformática
                    </span>
                </Link>

                {/* Ícono usuario con dropdown */}
                <Dropdown>
                    <DropdownTrigger>
                        <IconButton ariaLabel="Menú de usuario" hitSize={56} iconSize={42}>
                            <CircleUserRound size={42} color="#fff" />
                        </IconButton>
                    </DropdownTrigger>

                    <DropdownContent className="right-0 w-48">
                        {/* Cerrar sesion — navega al login */}
                        <DropdownItem>
                            <Link to="/auth" className="block w-full">
                                Cerrar sesion
                            </Link>
                        </DropdownItem>
                        <DropdownItem>
                            <Link to="/dashboard/home" className="block w-full">
                                Menu
                            </Link>
                        </DropdownItem>
                        <DropdownItem>
                            <button className="block w-full text-left">
                                Ver perfil
                            </button>
                        </DropdownItem>
                        <DropdownItem>
                            <Link to="/dashboard/config" className="block w-full">
                                Configuración
                            </Link>
                        </DropdownItem>
                    </DropdownContent>
                </Dropdown>
            </div>
        </nav>
    );
}
