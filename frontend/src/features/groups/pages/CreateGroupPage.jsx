import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const STORAGE_KEY = "grupos_list";

const MOCK_USERS = [
    { id: "001", label: "User-001" },
    { id: "002", label: "User-002" },
    { id: "003", label: "User-003" },
    { id: "004", label: "User-004" },
    { id: "005", label: "User-005" },
];

const permissionModules = [
    {
        name: "Módulo Usuarios",
        permissions: [
            "Asignar todos los permisos",
            "Crear Usuarios",
            "Editar Usuarios",
            "Listar Usuarios",
            "Habilitar / Deshabilitar Usuarios",
            "Reportes Usuarios",
        ],
    },
    {
        name: "Prestamo",
        permissions: [
            "Asignar todos los permisos",
            "Crear Prestamo",
            "Visualizar Prestamo",
            "Editar Prestamo",
            "Reportes Prestamo",
            "Listar Prestamos",
        ],
    },
    {
        name: "Material Consumo",
        permissions: [
            "Asignar todos los permisos",
            "Crear Material Consumo",
            "Visualizar Material Consumo",
            "Editar Material Consumo",
            "Habilitar / Deshabilitar Material Consumo",
            "Reportes Material Consumo",
            "Listar Material Consumo",
            "Retornar Sobrante Material Consumo",
        ],
    },
    {
        name: "Material devolutivo",
        permissions: [
            "Asignar todos los permisos",
            "Crear Material Devolutivo",
            "Listar Material Devolutivo",
            "Visualizar Material Devolutivo",
            "Editar Material Devolutivo",
            "Habilitar / Deshabilitar Material Devolutivo",
            "Reportes Material Devolutivo",
            "Regresar Material Devolutivo",
        ],
    },
];

export default function CreateGroupPage() {
    const navigate = useNavigate();

    const [permisoType, setPermisoType] = useState("grupal"); // "individual" | "grupal"
    const [identifier, setIdentifier] = useState("");
    const [groupName, setGroupName] = useState("");
    const [ficha, setFicha] = useState("");
    const [selectedPerms, setSelectedPerms] = useState({});

    // Combobox de usuarios
    const [userSearch, setUserSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUsers = MOCK_USERS.filter((u) =>
        u.label.toLowerCase().includes(userSearch.toLowerCase())
    );

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setIdentifier(user.id);
        setUserSearch(user.label);
        setDropdownOpen(false);
    };

    const togglePerm = (moduleName, perm) => {
        const key = `${moduleName}__${perm}`;
        setSelectedPerms((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isChecked = (moduleName, perm) => {
        const key = `${moduleName}__${perm}`;
        // "Asignar todos los permisos" controla los demás del módulo
        if (perm !== "Asignar todos los permisos") {
            const allKey = `${moduleName}__Asignar todos los permisos`;
            if (selectedPerms[allKey]) return true;
        }
        return !!selectedPerms[key];
    };

    const handleSave = () => {
        const name = permisoType === "grupal" ? groupName : identifier;
        if (!name.trim()) {
            alert("Por favor ingresa el nombre del grupo o número de identificación.");
            return;
        }

        const newGroup = {
            id: Date.now(),
            name: name.trim(),
            enabled: true,
            isEditing: false,
            permisoType,
            identifier,
            groupName,
            ficha,
            permissions: selectedPerms,
        };

        const saved = localStorage.getItem(STORAGE_KEY);
        const existing = saved ? JSON.parse(saved) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newGroup]));

        navigate("/dashboard/config/groups");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-10 w-full max-w-[1100px] relative">

                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/config/groups")}
                    className="absolute top-5 left-5 bg-transparent border-0 cursor-pointer text-white"
                    title="Regresar"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                <div className="flex gap-10">

                    {/* Panel izquierdo */}
                    <div className="min-w-[220px] flex flex-col gap-5">

                        {/* Radio buttons */}
                        <div className="flex flex-col gap-[10px] pt-10">
                            <label className="flex items-center gap-[10px] text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="permisoType"
                                    value="individual"
                                    checked={permisoType === "individual"}
                                    onChange={() => setPermisoType("individual")}
                                    className="accent-white w-[18px] h-[18px]"
                                />
                                Activar permiso individual
                            </label>
                            <label className="flex items-center gap-[10px] text-white cursor-pointer">
                                <input
                                    type="radio"
                                    name="permisoType"
                                    value="grupal"
                                    checked={permisoType === "grupal"}
                                    onChange={() => setPermisoType("grupal")}
                                    className="accent-[#7C3AED] w-[18px] h-[18px]"
                                />
                                Permisos Grupales
                            </label>
                        </div>

                        {/* Combobox usuarios */}
                        <div ref={dropdownRef} className="relative">
                            <label className="text-white text-[0.85rem]">Permisos individuales</label>

                            {/* Trigger del combobox */}
                            <div className={`w-full rounded-lg border border-[rgba(0,0,0,0.2)] bg-[rgba(217,217,217,0.54)] text-[0.9rem] mt-1 flex items-center justify-between overflow-hidden ${permisoType === "individual" ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
                                <input
                                    className={`flex-1 border-0 bg-transparent p-[10px_14px] text-[0.9rem] outline-none ${permisoType === "individual" ? "cursor-text" : "cursor-not-allowed"}`}
                                    placeholder="Buscar usuario..."
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        setSelectedUser(null);
                                        setIdentifier("");
                                        if (!dropdownOpen) setDropdownOpen(true);
                                    }}
                                    onFocus={() => {
                                        if (permisoType === "individual") setDropdownOpen(true);
                                    }}
                                    disabled={permisoType !== "individual"}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (permisoType === "individual") setDropdownOpen((o) => !o);
                                    }}
                                    className="bg-transparent border-0 px-3 cursor-pointer text-[#555] flex items-center"
                                    disabled={permisoType !== "individual"}
                                >
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                                    />
                                </button>
                            </div>

                            {/* Panel desplegable */}
                            {dropdownOpen && permisoType === "individual" && (
                                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[100] rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                                    {/* Header */}
                                    <div className="bg-[#6f077c] p-[10px_16px] text-white font-semibold text-[0.9rem] text-center">
                                        Usuarios
                                    </div>

                                    {/* Lista */}
                                    <div className="bg-white max-h-[180px] overflow-y-auto p-2 flex flex-col gap-[6px]">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-center text-[#888] text-[0.85rem] p-2">
                                                Sin resultados
                                            </p>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleSelectUser(user)}
                                                    className={`border-0 rounded-[30px] py-[9px] px-4 text-left cursor-pointer text-[0.88rem] font-medium text-[#222] transition-colors duration-[150ms] hover:bg-[rgba(112,13,124,0.15)] ${selectedUser?.id === user.id ? "bg-[rgba(112,13,124,0.12)]" : "bg-[#f5f5f5]"}`}
                                                >
                                                    {user.label}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Permisos grupales */}
                        <div>
                            <label className="text-white text-[0.85rem]">Permisos grupales</label>
                            <input
                                className={`w-full p-[10px_14px] rounded-lg border border-[rgba(0,0,0,0.2)] bg-[rgba(217,217,217,0.54)] text-[0.9rem] mt-1 ${permisoType === "grupal" ? "opacity-100" : "opacity-50"}`}
                                placeholder="Nombre del grupo"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                disabled={permisoType !== "grupal"}
                            />
                        </div>

                        {/* Número de ficha */}
                        <div>
                            <label className="text-white text-[0.85rem]">Numero de ficha</label>
                            <input
                                className="w-full p-[10px_14px] rounded-lg border border-[rgba(0,0,0,0.2)] bg-[rgba(217,217,217,0.54)] text-[0.9rem] mt-1"
                                placeholder="Numero"
                                value={ficha}
                                onChange={(e) => setFicha(e.target.value)}
                            />
                        </div>

                        {/* Botón Guardar */}
                        <button
                            onClick={handleSave}
                            className="mt-2 py-3 px-3 rounded-[30px] bg-[#700D7C] border-0 text-white font-semibold text-[0.95rem] cursor-pointer"
                        >
                            Guardar
                        </button>
                    </div>

                    {/* Panel derecho — módulos de permisos */}
                    <div className="flex-1 grid grid-cols-2 gap-4 content-start">
                        {permissionModules.map((mod) => (
                            <div key={mod.name} className="bg-[rgba(100,80,160,0.5)] rounded-[10px] p-[14px_16px]">
                                <p className="text-white font-bold text-[0.9rem] mb-[10px] pb-[6px] border-b border-white/20">
                                    {mod.name}
                                </p>
                                <div className="flex flex-col gap-[6px]">
                                    {mod.permissions.map((perm) => (
                                        <label
                                            key={perm}
                                            className="flex items-center gap-2 text-white text-[0.82rem] cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked(mod.name, perm)}
                                                onChange={() => togglePerm(mod.name, perm)}
                                                className="accent-[#7C3AED] w-[14px] h-[14px]"
                                            />
                                            {perm}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
