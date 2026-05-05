import { Search, User } from "lucide-react";
import { Link } from "react-router-dom"
import { IconButton, Dropdown, DropdownTrigger, DropdownContent ,DropdownItem } from "@/shared";
import logo from "@/assets/images/logo-1.png"

export default function Navbar(){
    return(
        <nav className="w-full border-b-2 bg-transparent">

            {/* Esta es la caja grande */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Esta es la caja que dentro de la primera caja */}
                <div className="flex h-16 items-center justify-between">

                    {/* Este logo esta dentro de la segunda caja */}
                    <div className="flex items-center">
                        <Link to={"/"} className="text-h1 font-heading ">
                            <img src={logo} alt="" className="h-12" />
                        </Link>
                    </div>

                    {/* Links de navegación */}
                    <ul className="hidden md:flex items-center gap-6">
                        <li>
                            <Link to={"/inicio"} className="hover:text-primary transition">Inicio</Link>
                        </li>

                        <li>
                            <Link to={"/cursos"} className="hover:text-primary transition">Cursos</Link>
                        </li>

                        <li>
                            <Link to={"/fotos"} className="hover:text-primary transition">Fotos</Link>
                        </li>

                        <li>
                            <Link to={"/lavadora"} className="hover:text-primary transition">Lavadora</Link>
                        </li>
                    </ul>
                    {/* Seccion de la derecha: busqueda + usuario */}
                    <div className="flex items-center gap-4">
                            {/* Icono de Buscador */}
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500"/>
                        
                            {/* Input */}
                        <input
                            type="text"
                            placeholder="Buscar en mileroticos"
                            className="pl-9 pr-4 py-2.5 border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-text-primary"
                        />
                        </div>

                            {/* Icono del usuario */}
                        {/* <button>
                            <IconButton ariaLabel="Menú de usuario">
                                <User/>
                            </IconButton>
                        </button> */}

                        <div className="p-10">
                            <Dropdown>
                                <DropdownTrigger>
                                    <IconButton ariaLabel="Menú de usuario">
                                        <User/>
                                    </IconButton>
                                </DropdownTrigger>

                                <DropdownContent className="right-0 w-48">
                                    <DropdownItem>
                                        <Link to="/auth" className="block w-full">
                                            Autenticación
                                        </Link>
                                    </DropdownItem>

                                    <DropdownItem>
                                        <Link to="/dashboard" className="block w-full">
                                            Panel de control
                                        </Link>
                                    </DropdownItem>

                                    <DropdownItem>
                                        <Link to="/dashboard/auth" className="block w-full">
                                            Cerrar sesión
                                        </Link>
                                    </DropdownItem>

                                </DropdownContent>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}