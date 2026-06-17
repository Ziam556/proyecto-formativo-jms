import { Link, useNavigate } from "react-router-dom";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import logo from "@/assets/images/logo-1.png";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="w-full bg-[linear-gradient(90deg,#5b2d8e_0%,#3a6ea8_100%)] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between h-[64px] md:h-[72px] px-4 md:px-8">

                {/* Logo + título */}
                <Link
                    to="/dashboard/home"
                    className="flex items-center gap-[10px] md:gap-[14px] no-underline text-white min-w-0"
                >
                    <img src={logo} alt="SENA" className="h-9 md:h-11 flex-shrink-0" />
                    <span className="font-semibold text-[0.95rem] md:text-[1.15rem] tracking-[0.01em] truncate hidden sm:block">
                        Inventario Teleinformática
                    </span>
                </Link>

                {/* Ícono usuario con dropdown */}
                <Dropdown>
                    <DropdownTrigger>
                        <IconButton ariaLabel="Menú de usuario" hitSize={44} iconSize={32}>
                            <CircleUserRound size={32} color="#fff" />
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
                            <Link to="/dashboard/userpage/profile" className="block w-full">
                                Ver perfil
                            </Link>
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
