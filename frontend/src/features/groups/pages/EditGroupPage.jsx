import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Checkbox, BackButton, alertSuccess, alertError, alertConfirm } from "@/shared";
import { getGroups, getGroupPermissions, getGroupUsers, updateGroup, addUsersToGroup, removeUsersFromGroup } from "../services/groupService";
import { getPermissions } from "../services/permissionService";
import { getUsers, assignUserPermissions, getUserPermissions } from "@/features/users/services/userService";

function getInitials(name) {
    return (name ?? "")
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

export default function EditGroupPage() {
    const navigate = useNavigate();
    const { id }   = useParams();

    // Grupo
    const [groupName, setGroupName]         = useState("");
    const [selectedPerms, setSelectedPerms] = useState({});
    const [permModules, setPermModules]     = useState([]);
    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);

    // Usuarios
    const [allUsers, setAllUsers]       = useState([]);
    const [memberState, setMemberState] = useState({}); // { [doc]: bool }
    const [origMembers, setOrigMembers] = useState(new Set()); // docs originalmente en el grupo
    const [userSearch, setUserSearch]   = useState("");

    // Permisos individuales
    const [groupPermCodenames, setGroupPermCodenames] = useState(new Set());
    const [activeUser, setActiveUser]                 = useState(null);
    const [userPermState, setUserPermState]           = useState({});
    const [savedPermsMap, setSavedPermsMap]           = useState({}); // { [doc]: codenames[] }

    useEffect(() => {
        Promise.all([
            getGroups(),
            getGroupPermissions(id),
            getPermissions(),
            getGroupUsers(id),
            getUsers(),
        ])
            .then(([groups, groupPerms, allPerms, groupUsers, users]) => {

                // Nombre del grupo
                const found = groups.find((g) => String(g.group_id) === String(id));
                if (found) setGroupName(found.group_name);

                // Agrupar todos los permisos por módulo
                const grouped = {};
                allPerms.forEach((p) => {
                    const mod = p.permission_module || "General";
                    if (!grouped[mod]) grouped[mod] = [];
                    grouped[mod].push({ id: p.permission_id, name: p.permission_name, codename: p.permission_codename });
                });
                setPermModules(Object.entries(grouped).map(([module, perms]) => ({ module, perms })));

                // Pre-marcar permisos del grupo
                const assignedIds = new Set(groupPerms.map((p) => p.permission_id));
                const initialPerms = {};
                allPerms.forEach((p) => { if (assignedIds.has(p.permission_id)) initialPerms[p.permission_id] = true; });
                setSelectedPerms(initialPerms);

                // Codenames del grupo para pre-marcar permisos individuales
                setGroupPermCodenames(new Set(groupPerms.map((p) => p.permission_codename)));

                // Estado de membresía: todos los usuarios, pre-marcados los del grupo
                const groupDocSet = new Set(groupUsers.map((u) => String(u.user_document_number)));
                setOrigMembers(groupDocSet);
                const initMember = {};
                users.forEach((u) => { initMember[String(u.user_document_number)] = groupDocSet.has(String(u.user_document_number)); });
                setMemberState(initMember);
                setAllUsers(users);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    // ── Permisos del grupo ──
    const togglePerm    = (permId) => setSelectedPerms((prev) => ({ ...prev, [permId]: !prev[permId] }));
    const isChecked     = (permId) => !!selectedPerms[permId];
    const isAllChecked  = (module) => !!selectedPerms[`all__${module}`];

    const toggleAll = (module, perms) => {
        const allKey = `all__${module}`;
        const newVal = !selectedPerms[allKey];
        const updates = { [allKey]: newVal };
        perms.forEach((p) => { updates[p.id] = newVal; });
        setSelectedPerms((prev) => ({ ...prev, ...updates }));
    };

    // ── Membresía ──
    const toggleMember = (doc) => setMemberState((prev) => ({ ...prev, [doc]: !prev[doc] }));

    const filteredUsers = allUsers.filter((u) => {
        const q = userSearch.toLowerCase();
        return (
            (u.user_name ?? "").toLowerCase().includes(q) ||
            String(u.user_document_number).includes(q)
        );
    });

    // ── Permisos individuales ──
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

    const closeUserPerms = () => { setActiveUser(null); setUserPermState({}); };

    const toggleIndivPerm   = (permId) => setUserPermState((prev) => ({ ...prev, [permId]: !prev[permId] }));
    const isIndivChecked    = (permId) => !!userPermState[permId];
    const isIndivAllChecked = (module) => !!userPermState[`all__${module}`];

    const toggleIndivAll = (module, perms) => {
        const allKey = `all__${module}`;
        const newVal = !userPermState[allKey];
        const updates = { [allKey]: newVal };
        perms.forEach((p) => { updates[p.id] = newVal; });
        setUserPermState((prev) => ({ ...prev, ...updates }));
    };

    const handleSaveUserPerms = () => {
        const codenames = [];
        permModules.forEach(({ perms }) => {
            perms.forEach((p) => { if (isIndivChecked(p.id)) codenames.push(p.codename); });
        });
        const doc = String(activeUser.user_document_number);
        setSavedPermsMap((prev) => ({ ...prev, [doc]: codenames }));
        closeUserPerms();
    };

    // ── Guardar todo ──
    const handleSave = async () => {
        if (!groupName.trim()) {
            alertError("Campo requerido", "El nombre del grupo no puede estar vacío.");
            return;
        }

        const confirmed = await alertConfirm(
            "¿Guardar cambios?",
            `¿Estás seguro de que deseas actualizar el grupo "${groupName}"?`
        );
        if (!confirmed.isConfirmed) return;

        // Codenames de permisos del grupo
        const codenames = [];
        permModules.forEach(({ perms }) => {
            perms.forEach((p) => { if (isChecked(p.id)) codenames.push(p.codename); });
        });

        // Diff de membresía
        const toAdd = allUsers
            .filter((u) => { const d = String(u.user_document_number); return memberState[d] && !origMembers.has(d); })
            .map((u) => String(u.user_document_number));
        const toRemove = allUsers
            .filter((u) => { const d = String(u.user_document_number); return !memberState[d] && origMembers.has(d); })
            .map((u) => String(u.user_document_number));

        try {
            setSaving(true);

            // 1. Actualizar nombre + permisos del grupo
            await updateGroup(id, groupName.trim(), codenames);

            // 2. Agregar nuevos miembros
            if (toAdd.length) await addUsersToGroup(id, toAdd);

            // 3. Quitar miembros desmarcados
            if (toRemove.length) await removeUsersFromGroup(id, toRemove);

            // 4. Aplicar permisos individuales configurados
            const permPromises = Object.entries(savedPermsMap).map(([doc, cnames]) =>
                assignUserPermissions(doc, cnames)
            );
            await Promise.all(permPromises);

            await alertSuccess("¡Grupo actualizado!", `El grupo "${groupName}" se guardó correctamente.`);

            // Actualizar origMembers para reflejar el nuevo estado guardado
            const newSet = new Set(
                allUsers
                    .filter((u) => memberState[String(u.user_document_number)])
                    .map((u) => String(u.user_document_number))
            );
            setOrigMembers(newSet);
            setSavedPermsMap({});
        } catch (err) {
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <p className="text-white">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-full px-4 sm:px-6 py-5">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-7 px-5 sm:px-8 w-full max-w-[1400px] mx-auto relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config/groups" />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-6">
                    {activeUser
                        ? `Permiso individual — ${activeUser.user_name ?? activeUser.user_document_number}`
                        : "Editar grupo"}
                </h2>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

                    {/* ── Panel izquierdo: nombre + usuarios (sticky en desktop) ── */}
                    <div className="w-full lg:w-[300px] lg:shrink-0 lg:sticky lg:top-4 flex flex-col gap-4">

                        {/* Nombre + botón guardar */}
                        <div className="bg-[rgba(80,40,110,0.55)] rounded-[14px] p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[rgba(255,255,255,0.75)] text-[0.85rem]">Nombre del grupo</label>
                                <Input
                                    placeholder="Nombre del grupo"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full">
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </div>

                        {/* Lista de usuarios */}
                        <div className="bg-[rgba(80,40,110,0.55)] rounded-[14px] p-4 flex flex-col gap-3">
                            <p className="text-white font-bold text-[0.9rem]">Usuarios</p>

                            <Input
                                placeholder="Buscar por nombre o documento..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />

                            <div
                                className="bg-[rgba(255,255,255,0.12)] rounded-xl overflow-hidden"
                                style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                                {filteredUsers.length === 0 ? (
                                    <p className="text-[rgba(255,255,255,0.5)] text-[0.82rem] text-center py-5">Sin resultados</p>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const doc      = String(u.user_document_number);
                                        const isMember = !!memberState[doc];
                                        const isActive = activeUser?.user_document_number === u.user_document_number;

                                        return (
                                            <div
                                                key={doc}
                                                className={`flex items-center gap-2 px-3 py-[10px] border-b border-white/10 last:border-0 transition-colors ${isActive ? "bg-[rgba(255,255,255,0.15)]" : "hover:bg-[rgba(255,255,255,0.06)]"}`}
                                            >
                                                {/* Avatar */}
                                                <div className="w-7 h-7 rounded-full bg-[rgba(112,13,124,0.55)] flex items-center justify-center text-white text-[0.65rem] font-bold shrink-0">
                                                    {getInitials(u.user_name)}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-[0.8rem] font-medium truncate">{u.user_name ?? "—"}</p>
                                                    <p className="text-[rgba(255,255,255,0.45)] text-[0.7rem]">Doc: {doc}</p>
                                                </div>

                                                {/* Botón permiso individual */}
                                                <button
                                                    onClick={() => isActive ? closeUserPerms() : openUserPerms(u)}
                                                    className="bg-transparent border-0 cursor-pointer text-[rgba(255,255,255,0.75)] text-[0.7rem] font-semibold hover:underline shrink-0"
                                                >
                                                    {isActive ? "Cerrar" : "Permiso individual"}
                                                </button>

                                                {/* Checkbox membresía */}
                                                <Checkbox
                                                    checked={isMember}
                                                    onChange={() => toggleMember(doc)}
                                                />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <p className="text-[rgba(255,255,255,0.4)] text-[0.7rem] text-center">
                                ✓ En el grupo &nbsp;·&nbsp; ☐ Fuera del grupo
                            </p>
                        </div>

                        {/* Botones del panel de permiso individual */}
                        {activeUser && (
                            <div className="flex gap-3 justify-end">
                                <Button variant="secondary" onClick={closeUserPerms}>Cancelar</Button>
                                <Button variant="primary" onClick={handleSaveUserPerms}>Guardar permisos</Button>
                            </div>
                        )}
                    </div>

                    {/* ── Panel derecho: permisos del grupo O permisos individuales ── */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                        {permModules.map(({ module, perms }) => (
                            <div key={module} className="bg-[rgba(100,80,160,0.5)] rounded-[10px] p-[14px_16px]">
                                <p className="text-white font-bold text-[0.9rem] mb-[10px] pb-[6px] border-b border-white/20">
                                    {module}
                                </p>
                                <div className="flex flex-col gap-[6px]">
                                    <label className="flex items-center gap-2 text-white text-[0.82rem] cursor-pointer font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={activeUser ? isIndivAllChecked(module) : isAllChecked(module)}
                                            onChange={() => activeUser ? toggleIndivAll(module, perms) : toggleAll(module, perms)}
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
                                                    checked={activeUser
                                                        ? isIndivChecked(perm.id) || isIndivAllChecked(module)
                                                        : isChecked(perm.id) || isAllChecked(module)}
                                                    onChange={() => activeUser ? toggleIndivPerm(perm.id) : togglePerm(perm.id)}
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

                </div>
            </div>
        </div>
    );
}
