import { Link, useNavigate } from "react-router-dom";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/shared";
import logo from "@/assets/images/logo-1.png";
import { CircleUserRound } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav
            style={{
                width: "100%",
                background: "linear-gradient(90deg, #5b2d8e 0%, #3a6ea8 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "72px",
                    padding: "0 32px",
                }}
            >
                {/* Logo + título */}
                <Link
                    to="/dashboard/home"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        textDecoration: "none",
                        color: "#fff",
                    }}
                >
                    <img src={logo} alt="SENA" style={{ height: "44px" }} />
                    <span style={{ fontWeight: 600, fontSize: "1.15rem", letterSpacing: "0.01em" }}>
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