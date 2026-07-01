import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Input, Button, Checkbox, BackButton, alertSuccess, alertError } from "@/shared";
import { getUsers, assignUserPermissions, getUserPermissions } from "@/features/users/services/userService";
import { getPermissions } from "../services/permissionService";
import { addUsersToGroup, getGroupPermissions } from "../services/groupService";

function getInitials(name) {
    return (name ?? "")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

export default function AddUsersToGroupPage() {
    const navigate  = useNavigate();
    const { id }    = useParams();
    const location  = useLocation();
    const groupName = location.state?.groupName ?? `Grupo #${id}`;

    const [users, setUsers]         = useState([]);
    const [search, setSearch]       = useState("");
    const [selected, setSelected]   = useState({});
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);

    // Permisos individuales
    const [permModules, setPermModules]               = useState([]);
    const [groupPermCodenames, setGroupPermCodenames] = useState(new Set());
    const [activeUser, setActiveUser]                 = useState(null); // usuario con panel abierto
    const [userPermState, setUserPermState]           = useState({});
    // Permisos guardados localmente por usuario { [doc]: codenames[] }
    const [savedPermsMap, setSavedPermsMap]           = useState({});

    useEffect(() => {
        Promise.all([
            getUsers(),
            getPermissions(),
            getGroupPermissions(id),
        ])
            .then(([usersData, allPerms, groupPerms]) => {
                setUsers(usersData);

                // Agrupar todos los permisos por módulo
                const grouped = {};
                allPerms.forEach((p) => {
                    const mod = p.permission_module || "General";
                    if (!grouped[mod]) grouped[mod] = [];
                    grouped[mod].push({
                        id:       p.permission_id,
                        name:     p.permission_name,
                        codename: p.permission_codename,
                    });
                });
                setPermModules(Object.entries(grouped).map(([module, perms]) => ({ module, perms })));

                // Codenames del grupo para pre-marcar permisos individuales
                setGroupPermCodenames(new Set(groupPerms.map((p) => p.permission_codename)));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            (u.user_name ?? "").toLowerCase().includes(q) ||
            String(u.user_document_number).includes(q)
        );
    });

    const toggleSelect = (doc) => setSelected((prev) => ({ ...prev, [doc]: !prev[doc] }));

    const selectedCount = Object.values(selected).filter(Boolean).length;

    // Abrir panel de permisos para un usuario
    const openUserPerms = async (user) => {
        setActiveUser(user);
        const doc = String(user.user_document_number);

        // Prioridad: savedPermsMap (sesión) → BD → permisos del grupo
        let codenameSet;
        if (savedPermsMap[doc]) {
            codenameSet = new Set(savedPermsMap[doc]);
        } else {
            try {
                const dbCodenames = await getUserPermissions(doc);
                codenameSet = dbCodenames.length > 0
                    ? new Set(dbCodenames)
                    : groupPermCodenames; // fallback al grupo si no tiene individuales
            } catch {
                codenameSet = groupPermCodenames;
            }
        }

        const initial = {};
        permModules.forEach(({ perms }) => {
            perms.forEach((p) => { initial[p.id] = codenameSet.has(p.codename); });
        });
        setUserPermState(initial);
    };

    const closeUserPerms = () => {
        setActiveUser(null);
        setUserPermState({});
    };

    const togglePerm    = (permId) => setUserPermState((prev) => ({ ...prev, [permId]: !prev[permId] }));
    const isChecked     = (permId) => !!userPermState[permId];
    const isAllChecked  = (module) => !!userPermState[`all__${module}`];

    const toggleAll = (module, perms) => {
        const allKey = `all__${module}`;
        const newVal = !userPermState[allKey];
        const updates = { [allKey]: newVal };
        perms.forEach((p) => { updates[p.id] = newVal; });
        setUserPermState((prev) => ({ ...prev, ...updates }));
    };

    const handleSaveUserPerms = () => {
        // Solo guarda localmente — se aplica a BD al confirmar agregar al grupo
        const codenames = [];
        permModules.forEach(({ perms }) => {
            perms.forEach((p) => {
                if (isChecked(p.id)) codenames.push(p.codename);
            });
        });
        const doc = String(activeUser.user_document_number);
        setSavedPermsMap((prev) => ({ ...prev, [doc]: codenames }));
        closeUserPerms();
    };

    const handleConfirm = async () => {
        const documentNumbers = Object.entries(selected)
            .filter(([, v]) => v)
            .map(([doc]) => doc);

        if (!documentNumbers.length) {
            alertError("Sin selección", "Selecciona al menos un usuario.");
            return;
        }

        try {
            setSaving(true);

            // 1. Agregar usuarios al grupo
            await addUsersToGroup(id, documentNumbers);

            // 2. Aplicar permisos individuales configurados para cada usuario seleccionado
            const permPromises = documentNumbers
                .filter((doc) => savedPermsMap[doc])
                .map((doc) => assignUserPermissions(doc, savedPermsMap[doc]));
            await Promise.all(permPromises);

            await alertSuccess(
                "¡Usuarios agregados!",
                `Se agregaron ${documentNumbers.length} usuario(s) al grupo "${groupName}".`
            );
            navigate("/dashboard/config/groups");
        } catch (err) {
            alertError("Error", err.message || "Ocurrió un error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    const showPermsPanel = !!activeUser;

    return (
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div
                className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full relative transition-all duration-300"
                style={{ maxWidth: showPermsPanel ? "1100px" : "520px" }}
            >
                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton onClick={() => showPermsPanel ? closeUserPerms() : navigate("/dashboard/config/groups")} />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.2rem] font-bold mb-1">
                    {showPermsPanel
                        ? `Permiso individual — ${activeUser.user_name ?? activeUser.user_document_number}`
                        : "Agregar usuarios al grupo"}
                </h2>
                <p className="text-center text-[rgba(255,255,255,0.65)] text-[0.82rem] mb-5">
                    Grupo: <strong className="text-white">{groupName}</strong>
                </p>

                <div className={`flex gap-8 ${showPermsPanel ? "flex-row items-start" : "flex-col"}`}>

                    {/* ── Panel izquierdo — lista de usuarios ── */}
                    <div className={showPermsPanel ? "w-[300px] shrink-0 flex flex-col gap-4" : "w-full flex flex-col gap-4"}>

                        {/* Badge contador (solo cuando no hay panel de permisos) */}
                        {selectedCount > 0 && !showPermsPanel && (
                            <div className="flex justify-center">
                                <span className="bg-[rgba(80,229,249,0.2)] text-[#50E5F9] text-[0.75rem] font-semibold px-3 py-1 rounded-full border border-[rgba(80,229,249,0.35)]">
                                    {selectedCount} usuario{selectedCount !== 1 ? "s" : ""} seleccionado{selectedCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}

                        {/* Buscador */}
                        <Input
                            placeholder="Buscar por nombre o documento..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Lista */}
                        <div
                            className="bg-[rgba(255,255,255,0.15)] rounded-xl overflow-hidden"
                            style={{ maxHeight: "320px", overflowY: "auto" }}
                        >
                            {loading ? (
                                <p className="text-white text-[0.85rem] text-center py-6">Cargando usuarios...</p>
                            ) : filtered.length === 0 ? (
                                <p className="text-[rgba(255,255,255,0.6)] text-[0.85rem] text-center py-6">Sin resultados</p>
                            ) : (
                                filtered.map((u) => {
                                    const doc     = String(u.user_document_number);
                                    const isActive = activeUser?.user_document_number === u.user_document_number;

                                    return (
                                        <div
                                            key={doc}
                                            className={`flex items-center gap-3 px-4 py-3 border-b border-white/15 last:border-0 transition-colors ${isActive ? "bg-[rgba(255,255,255,0.15)]" : "hover:bg-[rgba(255,255,255,0.06)]"}`}
                                        >
                                            {/* Avatar iniciales */}
                                            <div className="w-8 h-8 rounded-full bg-[rgba(112,13,124,0.55)] flex items-center justify-center text-white text-[0.72rem] font-bold shrink-0">
                                                {getInitials(u.user_name)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-[0.85rem] font-medium truncate">{u.user_name ?? "—"}</p>
                                                <p className="text-[rgba(255,255,255,0.5)] text-[0.74rem]">Doc: {doc}</p>
                                            </div>

                                            {/* Botón permiso individual */}
                                            <button
                                                onClick={() => isActive ? closeUserPerms() : openUserPerms(u)}
                                                className="bg-transparent border-0 cursor-pointer text-[rgba(255,255,255,0.8)] text-[0.78rem] font-semibold hover:underline shrink-0"
                                            >
                                                {isActive ? "Cerrar" : "Permiso individual"}
                                            </button>

                                            {/* Checkbox agregar al grupo (oculto en modo permisos) */}
                                            {!showPermsPanel && (
                                                <Checkbox
                                                    checked={!!selected[doc]}
                                                    onChange={() => toggleSelect(doc)}
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Botones confirmar / omitir */}
                        {!showPermsPanel && (
                            <div className="flex gap-3 justify-end">
                                <Button variant="secondary" onClick={() => navigate("/dashboard/config/groups")} disabled={saving}>
                                    Omitir
                                </Button>
                                <Button variant="primary" onClick={handleConfirm} disabled={saving}>
                                    {saving ? "Guardando..." : "Confirmar"}
                                </Button>
                            </div>
                        )}

                        {/* Botones guardar permisos individuales */}
                        {showPermsPanel && (
                            <div className="flex gap-3 justify-end">
                                <Button variant="secondary" onClick={closeUserPerms}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleSaveUserPerms}>
                                    Guardar permisos
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ── Panel derecho — módulos de permisos individuales ── */}
                    {showPermsPanel && (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                            {permModules.map(({ module, perms }) => (
                                <div key={module} className="bg-[rgba(100,80,160,0.5)] rounded-[10px] p-[14px_16px]">
                                    <p className="text-white font-bold text-[0.9rem] mb-[10px] pb-[6px] border-b border-white/20">
                                        {module}
                                    </p>
                                    <div className="flex flex-col gap-[6px]">
                                        <label className="flex items-center gap-2 text-white text-[0.82rem] cursor-pointer font-semibold">
                                            <input
                                                type="checkbox"
                                                checked={isAllChecked(module)}
                                                onChange={() => toggleAll(module, perms)}
                                                className="accent-[#7C3AED] w-[14px] h-[14px]"
                                            />
                                            Asignar todos los permisos
                                        </label>
                                        <div style={{ maxHeight: "182px", overflowY: "auto" }} className="flex flex-col gap-[6px] pr-[2px]">
                                            {perms.map((perm) => (
                                                <label
                                                    key={perm.id}
                                                    className="flex items-center gap-2 text-white text-[0.82rem] cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked(perm.id) || isAllChecked(module)}
                                                        onChange={() => togglePerm(perm.id)}
                                                        className="accent-[#7C3AED] w-[14px] h-[14px]"
                                                    />
                                                    {perm.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
