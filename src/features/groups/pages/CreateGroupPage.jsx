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

const cardStyle = {
    background: "linear-gradient(135deg, #700D7C 0%, #88A3C7 50%, #50E5F9 100%)",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "1100px",
    position: "relative",
};

const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(217,217,217,0.54)",
    fontSize: "0.9rem",
    marginTop: "4px",
};

const moduleBoxStyle = {
    background: "rgba(100,80,160,0.5)",
    borderRadius: "10px",
    padding: "14px 16px",
};

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
        <div style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            <div style={cardStyle}>

                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/config/groups")}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                    }}
                    title="Regresar"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                <div style={{ display: "flex", gap: "40px" }}>

                    {/* Panel izquierdo */}
                    <div style={{ minWidth: "220px", display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Radio buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "40px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="permisoType"
                                    value="individual"
                                    checked={permisoType === "individual"}
                                    onChange={() => setPermisoType("individual")}
                                    style={{ accentColor: "#fff", width: "18px", height: "18px" }}
                                />
                                Activar permiso individual
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="permisoType"
                                    value="grupal"
                                    checked={permisoType === "grupal"}
                                    onChange={() => setPermisoType("grupal")}
                                    style={{ accentColor: "#7C3AED", width: "18px", height: "18px" }}
                                />
                                Permisos Grupales
                            </label>
                        </div>

                        {/* Inputs */}
                        <div ref={dropdownRef} style={{ position: "relative" }}>
                            <label style={{ color: "#fff", fontSize: "0.85rem" }}>Permisos individuales</label>

                            {/* Trigger del combobox */}
                            <div style={{
                                ...inputStyle,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                opacity: permisoType === "individual" ? 1 : 0.5,
                                cursor: permisoType === "individual" ? "pointer" : "not-allowed",
                                padding: "0",
                                overflow: "hidden",
                            }}>
                                <input
                                    style={{
                                        flex: 1,
                                        border: "none",
                                        background: "transparent",
                                        padding: "10px 14px",
                                        fontSize: "0.9rem",
                                        outline: "none",
                                        cursor: permisoType === "individual" ? "text" : "not-allowed",
                                    }}
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
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "0 12px",
                                        cursor: "pointer",
                                        color: "#555",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    disabled={permisoType !== "individual"}
                                >
                                    <ChevronDown
                                        size={18}
                                        style={{
                                            transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s",
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Panel desplegable */}
                            {dropdownOpen && permisoType === "individual" && (
                                <div style={{
                                    position: "absolute",
                                    top: "calc(100% + 4px)",
                                    left: 0,
                                    right: 0,
                                    zIndex: 100,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        background: "#6f077c",
                                        padding: "10px 16px",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        textAlign: "center",
                                    }}>
                                        Usuarios
                                    </div>

                                    {/* Lista */}
                                    <div style={{
                                        background: "#fff",
                                        maxHeight: "180px",
                                        overflowY: "auto",
                                        padding: "8px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                    }}>
                                        {filteredUsers.length === 0 ? (
                                            <p style={{ textAlign: "center", color: "#888", fontSize: "0.85rem", padding: "8px" }}>
                                                Sin resultados
                                            </p>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleSelectUser(user)}
                                                    style={{
                                                        background: selectedUser?.id === user.id
                                                            ? "rgba(112,13,124,0.12)"
                                                            : "#f5f5f5",
                                                        border: "none",
                                                        borderRadius: "30px",
                                                        padding: "9px 16px",
                                                        textAlign: "left",
                                                        cursor: "pointer",
                                                        fontSize: "0.88rem",
                                                        fontWeight: 500,
                                                        color: "#222",
                                                        transition: "background 0.15s",
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(112,13,124,0.15)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = selectedUser?.id === user.id ? "rgba(112,13,124,0.12)" : "#f5f5f5"}
                                                >
                                                    {user.label}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ color: "#fff", fontSize: "0.85rem" }}>Permisos grupales</label>
                            <input
                                style={{
                                    ...inputStyle,
                                    opacity: permisoType === "grupal" ? 1 : 0.5,
                                }}
                                placeholder="Nombre del grupo"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                disabled={permisoType !== "grupal"}
                            />
                        </div>

                        <div>
                            <label style={{ color: "#fff", fontSize: "0.85rem" }}>Numero de ficha</label>
                            <input
                                style={inputStyle}
                                placeholder="Numero"
                                value={ficha}
                                onChange={(e) => setFicha(e.target.value)}
                            />
                        </div>

                        {/* Botón Guardar */}
                        <button
                            onClick={handleSave}
                            style={{
                                marginTop: "8px",
                                padding: "12px",
                                borderRadius: "30px",
                                background: "#700D7C",
                                border: "none",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                cursor: "pointer",
                            }}
                        >
                            Guardar
                        </button>
                    </div>

                    {/* Panel derecho — módulos de permisos */}
                    <div style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                        alignContent: "start",
                    }}>
                        {permissionModules.map((mod) => (
                            <div key={mod.name} style={moduleBoxStyle}>
                                <p style={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    marginBottom: "10px",
                                    paddingBottom: "6px",
                                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                                }}>
                                    {mod.name}
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {mod.permissions.map((perm) => (
                                        <label
                                            key={perm}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                color: "#fff",
                                                fontSize: "0.82rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked(mod.name, perm)}
                                                onChange={() => togglePerm(mod.name, perm)}
                                                style={{ accentColor: "#7C3AED", width: "14px", height: "14px" }}
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
