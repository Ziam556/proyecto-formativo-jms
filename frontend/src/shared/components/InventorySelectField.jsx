import { useState, useEffect } from "react";
import { Plus, X, PackagePlus } from "lucide-react";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import { getInventories, createInventory } from "@/features/inventories/services/inventoryService";
import { alertError } from "../utils/alerts";

/**
 * Select de inventario con botón "+" para crear uno nuevo en línea.
 * El inventario creado se guarda en la misma tabla que el módulo de inventarios.
 *
 * Props:
 *  - label        {string}
 *  - value        {string}
 *  - onChange     {Function} — (e) => void  (evento sintético para compatibilidad con handleChange)
 *  - name         {string}
 *  - error        {string}
 *  - labelVariant {"light"|"dark"}
 *  - required     {boolean}
 */
export default function InventorySelectField({
    label        = "Nombre de inventario (opcional)",
    value        = "",
    onChange,
    name         = "materialInventory",
    error,
    labelVariant = "light",
    required     = false,
}) {
    const [options,     setOptions]     = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [newName,     setNewName]     = useState("");
    const [saving,      setSaving]      = useState(false);
    const [nameError,   setNameError]   = useState("");

    const load = () =>
        getInventories()
            .then((invs) =>
                setOptions(
                    invs
                        .filter((i) => i.enabled)
                        .map((i) => ({ id: i.name, label: i.name }))
                )
            )
            .catch(() => {});

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        const trimmed = newName.trim();
        if (!trimmed) {
            setNameError("El nombre es requerido");
            return;
        }
        setSaving(true);
        try {
            const inv = await createInventory(trimmed);
            await load();
            // Seleccionar el nuevo inventario automáticamente
            onChange({ target: { name, value: inv.name } });
            setShowOverlay(false);
            setNewName("");
            setNameError("");
        } catch (err) {
            alertError("Error al crear inventario", err.message || "Intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setShowOverlay(false);
        setNewName("");
        setNameError("");
    };

    return (
        <>
            {/* ── Campo principal: Select + botón "+" ── */}
            <div className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                    <Select
                        labelVariant={labelVariant}
                        label={label}
                        name={name}
                        value={value}
                        options={options}
                        onChange={onChange}
                        error={error}
                        placeholder="Selecciona un inventario"
                        required={required}
                    />
                </div>

                {/* Botón "+" — abre overlay para crear inventario */}
                <button
                    type="button"
                    title="Crear nuevo inventario"
                    onClick={() => setShowOverlay(true)}
                    className={`
                        flex-shrink-0 w-9 h-9 rounded-full
                        flex items-center justify-center cursor-pointer
                        bg-[#00C8DC] text-black font-semibold
                        hover:opacity-85 transition-opacity
                        ${error ? "mb-[26px]" : "mb-[2px]"}
                    `}
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* ── Overlay para crear inventario ── */}
            {showOverlay && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm mx-4 rounded-2xl bg-[#1e1e2e] border border-white/15 shadow-2xl p-6 flex flex-col gap-5">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-[rgba(0,200,220,0.15)]">
                                    <PackagePlus size={18} style={{ color: "#00C8DC" }} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm leading-tight">Nuevo inventario</p>
                                    <p className="text-white/50 text-xs">Se agregará a la lista de inventarios</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Input nombre */}
                        <Input
                            labelVariant="light"
                            label="Nombre del inventario"
                            placeholder="Ej: Inventario Principal"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setNameError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            error={nameError}
                            required
                            autoFocus
                        />

                        {/* Botones */}
                        <div className="flex gap-3 justify-end">
                            <Button variant="secondary" size="sm" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleCreate} disabled={saving}>
                                {saving ? "Guardando…" : "Crear inventario"}
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
