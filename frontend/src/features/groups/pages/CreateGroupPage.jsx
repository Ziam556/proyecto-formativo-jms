import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../services/groupService";
import { getPermissions } from "../services/permissionService";
import { Input, Button, BackButton, alertSuccess, alertError, alertConfirm } from "@/shared";

export default function CreateGroupPage() {
    const navigate = useNavigate();

    const [groupName, setGroupName]         = useState("");
    const [selectedPerms, setSelectedPerms] = useState({});
    const [permModules, setPermModules]     = useState([]);
    const [loadingPerms, setLoadingPerms]   = useState(true);
    const [saving, setSaving]               = useState(false);

    useEffect(() => {
        getPermissions()
            .then((perms) => {
                const grouped = {};
                perms.forEach((p) => {
                    const mod = p.permission_module || "General";
                    if (!grouped[mod]) grouped[mod] = [];
                    grouped[mod].push({
                        id:       p.permission_id,
                        name:     p.permission_name,
                        codename: p.permission_codename,
                    });
                });
                setPermModules(
                    Object.entries(grouped).map(([module, perms]) => ({ module, perms }))
                );
            })
            .catch((err) => { console.error("Error cargando permisos:", err); setPermModules([]); })
            .finally(() => setLoadingPerms(false));
    }, []);

    const togglePerm = (permId) => {
        setSelectedPerms((prev) => ({ ...prev, [permId]: !prev[permId] }));
    };

    const toggleAll = (module, perms) => {
        const allKey = `all__${module}`;
        const newVal = !selectedPerms[allKey];
        const updates = { [allKey]: newVal };
        perms.forEach((p) => { updates[p.id] = newVal; });
        setSelectedPerms((prev) => ({ ...prev, ...updates }));
    };

    const isChecked    = (permId) => !!selectedPerms[permId];
    const isAllChecked = (module) => !!selectedPerms[`all__${module}`];

    const handleSave = async () => {
        if (!groupName.trim()) {
            alertError("Campo requerido", "Ingresa el nombre del grupo.");
            return;
        }

        const codenames = [];
        permModules.forEach(({ perms }) => {
            perms.forEach((p) => {
                if (isChecked(p.id)) codenames.push(p.codename);
            });
        });

        try {
            setSaving(true);
            const group = await createGroup(groupName.trim(), codenames);
            await alertSuccess("¡Grupo creado!", `El grupo "${groupName}" se registró correctamente.`);

            const confirmed = await alertConfirm(
                "¿Agregar usuarios al grupo?",
                "¿Deseas agregar usuarios a este grupo ahora?"
            );

            if (confirmed.isConfirmed) {
                navigate(`/dashboard/config/groups/${group.group_id}/add-users`, {
                    state: { groupName: groupName.trim() },
                });
            } else {
                setGroupName("");
                setSelectedPerms({});
            }
        } catch (err) {
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-full px-4 sm:px-6 py-5">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-7 px-5 sm:px-8 w-full max-w-[1400px] mx-auto relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config/groups" />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-6">
                    Crear grupo
                </h2>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">

                    {/* Panel izquierdo — sticky en desktop */}
                    <div className="w-full lg:w-[240px] lg:flex-shrink-0 lg:sticky lg:top-4">
                        <div className="bg-[rgba(80,40,110,0.55)] rounded-[14px] p-5 flex flex-col gap-4">
                            <Input
                                label="Nombre del grupo"
                                placeholder="Nombre del grupo"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full mt-2">
                                {saving ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </div>

                    {/* Panel derecho — módulos de permisos en 3 columnas */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                        {loadingPerms ? (
                            <p className="text-white text-[0.85rem] col-span-2">Cargando permisos...</p>
                        ) : permModules.map(({ module, perms }) => (
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

                </div>
            </div>
        </div>
    );
}
