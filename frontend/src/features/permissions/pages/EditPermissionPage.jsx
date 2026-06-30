import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Select, BackButton, alertSuccess, alertError, alertConfirm } from "@/shared";
import { getPermissions, updatePermission } from "../services/permissionService";

const MODULES = [
    "Módulo Usuarios",
    "Préstamo",
    "Material Consumo",
    "Material Devolutivo",
    "Marcas",
    "General",
];

export default function EditPermissionPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({ name: "", codename: "", module: "General" });
    const [assignedTo, setAssignedTo] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPermissions().then((all) => {
            const found = all.find((p) => String(p.permission_id) === String(id));
            if (found) {
                setForm({
                    name: found.permission_name,
                    codename: found.permission_codename,
                    module: found.permission_module || "General",
                });
            }
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        if (!form.name.trim() || !form.codename.trim()) {
            setError("Nombre y codename son obligatorios.");
            return;
        }
        const confirmed = await alertConfirm(
            "¿Editar permiso?",
            `¿Estás seguro de que deseas guardar los cambios en "${form.name}"?`
        );
        if (!confirmed.isConfirmed) return;

        try {
            setSaving(true);
            setError(null);
            await updatePermission(id, form);
            await alertSuccess("¡Permiso actualizado!", `El permiso "${form.name}" se guardó correctamente.`);
        } catch (err) {
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado.");
            setError(err.message);
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
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full max-w-[900px] relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config/permissions" />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-7">
                    Editar Permiso
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Panel izquierdo — formulario */}
                    <div className="w-full lg:min-w-[240px] lg:max-w-[280px] flex flex-col gap-4">
                        <div className="bg-[rgba(80,40,110,0.55)] rounded-[14px] p-5 flex flex-col gap-4">
                            <Input
                                label="Nombre del permiso"
                                placeholder="Ej: Crear usuario"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <div>
                                <Input
                                    label="Codename"
                                    placeholder="Ej: create_user"
                                    value={form.codename}
                                    onChange={(e) => setForm((prev) => ({ ...prev, codename: e.target.value }))}
                                />
                                <p className="text-[rgba(255,255,255,0.55)] text-[0.75rem] mt-1">
                                    Identificador único sin espacios.
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
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </div>
                    </div>

                    {/* Panel derecho — info del codename actual */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <div className="bg-[rgba(0,0,0,0.1)] rounded-lg px-4 py-2 text-[rgba(255,255,255,0.7)] text-[0.85rem]">
                            Detalles del permiso
                        </div>
                        <div className="bg-[rgba(255,255,255,0.15)] rounded-xl p-5 flex flex-col gap-4">
                            <div>
                                <p className="text-[rgba(255,255,255,0.6)] text-[0.78rem] mb-1">Nombre actual</p>
                                <p className="text-white font-semibold text-[0.95rem]">{form.name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-[rgba(255,255,255,0.6)] text-[0.78rem] mb-1">Codename actual</p>
                                <span className="font-mono text-[0.85rem] text-[#50E5F9] bg-[rgba(0,0,0,0.2)] px-3 py-1 rounded-full">
                                    {form.codename || "—"}
                                </span>
                            </div>
                            <div>
                                <p className="text-[rgba(255,255,255,0.6)] text-[0.78rem] mb-1">Módulo</p>
                                <p className="text-white text-[0.9rem]">{form.module}</p>
                            </div>
                            <div className="border-t border-white/20 pt-3">
                                <p className="text-[rgba(255,255,255,0.5)] text-[0.75rem]">
                                    Cambiar el codename puede afectar grupos y usuarios que ya tienen este permiso asignado.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
