import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Select, BackButton, alertSuccess, alertError } from "@/shared";
import { createPermission, getPermissions } from "../services/permissionService";

const MODULES = [
    "Módulo Usuarios",
    "Préstamo",
    "Material Consumo",
    "Material Devolutivo",
    "Marcas",
    "General",
];

export default function CreatePermissionPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", codename: "", module: "General" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [existingPerms, setExistingPerms] = useState([]);

    useEffect(() => {
        getPermissions().then(setExistingPerms).catch(() => {});
    }, []);

    const handleNameChange = (e) => {
        setForm((prev) => ({ ...prev, name: e.target.value }));
    };

    const handleCodenameChange = (e) => {
        const value = e.target.value
            .replace(/ /g, "_")                  // espacio → _
            .replace(/[^a-z0-9_]/g, "");         // solo letras minúsculas, números y _
        setForm((prev) => ({ ...prev, codename: value }));
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.codename.trim()) {
            setError("Nombre y codename son obligatorios.");
            return;
        }
        if (!/^[a-z0-9_]+$/.test(form.codename)) {
            setError("El codename solo puede contener letras minúsculas, números y guion bajo (_).");
            return;
        }
        try {
            setSaving(true);
            setError(null);
            const created = await createPermission(form);
            await alertSuccess("¡Permiso creado!", `El permiso "${form.name}" se registró correctamente.`);
            // Refrescar lista y vaciar formulario
            const updated = await getPermissions();
            setExistingPerms(updated);
            setForm({ name: "", codename: "", module: "General" });
        } catch (err) {
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado.");
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full max-w-[1000px] relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config/permissions" />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-7">
                    Crear Permiso
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Panel izquierdo — formulario */}
                    <div className="w-full lg:min-w-[240px] lg:max-w-[280px] flex flex-col gap-4">
                        <div className="bg-[rgba(80,40,110,0.55)] rounded-[14px] p-5 flex flex-col gap-4">
                            <Input
                                label="Nombre del permiso"
                                placeholder="Ej: Crear usuario"
                                value={form.name}
                                onChange={handleNameChange}
                            />
                            <div>
                                <Input
                                    label="Codename"
                                    placeholder="Ej: create_user"
                                    value={form.codename}
                                    onChange={handleCodenameChange}
                                />
                                <p className="text-[rgba(255,255,255,0.55)] text-[0.75rem] mt-1">
                                    En inglés, sin espacios ni tildes. Ej: create_user
                                </p>
                            </div>
                            <Select
                                label="Módulo"
                                name="module"
                                value={form.module}
                                options={MODULES.map((m) => ({ value: m, label: m }))}
                                onChange={(e) => setForm((prev) => ({ ...prev, module: e.target.value }))}
                            />

                            {error && (
                                <p className="text-red-200 text-[0.82rem]">{error}</p>
                            )}

                            <Button variant="primary" onClick={handleSave} disabled={saving} className="w-full mt-2">
                                {saving ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </div>

                    {/* Panel derecho — permisos existentes */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[rgba(0,0,0,0.1)] rounded-lg px-4 py-2 text-[rgba(255,255,255,0.7)] text-[0.85rem] mb-3">
                            Permisos existentes
                        </div>
                        <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] rounded-xl overflow-hidden">
                            <table className="w-full border-collapse table-fixed">
                                <colgroup>
                                    <col style={{ width: "40%" }} />
                                    <col style={{ width: "35%" }} />
                                    <col style={{ width: "25%" }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th className="p-[9px_16px] text-left text-[0.82rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">Nombre</th>
                                        <th className="p-[9px_16px] text-left text-[0.82rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">Codename</th>
                                        <th className="p-[9px_16px] text-left text-[0.82rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">Módulo</th>
                                    </tr>
                                </thead>
                            </table>
                            <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                                <table className="w-full border-collapse table-fixed">
                                    <colgroup>
                                        <col style={{ width: "40%" }} />
                                        <col style={{ width: "35%" }} />
                                        <col style={{ width: "25%" }} />
                                    </colgroup>
                                    <tbody>
                                        {existingPerms.map((p) => (
                                            <tr key={p.permission_id}>
                                                <td className="p-[8px_16px] text-[0.85rem] text-[#111] border-b border-white/20 bg-[rgba(255,255,255,0.55)]">{p.permission_name}</td>
                                                <td className="p-[8px_16px] border-b border-white/20 bg-[rgba(255,255,255,0.55)]">
                                                    <span className="font-mono text-[0.78rem] text-[#700D7C] bg-[rgba(112,13,124,0.1)] px-2 py-[2px] rounded-full break-all">
                                                        {p.permission_codename}
                                                    </span>
                                                </td>
                                                <td className="p-[8px_16px] text-[0.82rem] text-[#555] border-b border-white/20 bg-[rgba(255,255,255,0.55)]">{p.permission_module}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
