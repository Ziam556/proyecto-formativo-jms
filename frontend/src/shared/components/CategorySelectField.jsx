import { useState, useEffect } from "react";
import { Plus, X, Tag } from "lucide-react";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import { getCategories, createCategory } from "@/features/categories/services/categoryService";
import { alertError } from "../utils/alerts";

/**
 * Select de tipo de material con botón "+" para crear uno nuevo en línea.
 *
 * Props:
 *  - label        {string}
 *  - value        {string}
 *  - onChange     {Function} — (e) => void
 *  - name         {string}
 *  - error        {string}
 *  - labelVariant {"light"|"dark"}
 *  - required     {boolean}
 */
export default function CategorySelectField({
    label        = "Tipo de material",
    value        = "",
    onChange,
    name         = "materialCategory",
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
        getCategories()
            .then((cats) =>
                setOptions(
                    cats
                        .filter((c) => c.enabled)
                        .map((c) => ({ id: c.name, label: c.name }))
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
            const cat = await createCategory(trimmed);
            await load();
            onChange({ target: { name, value: cat.name } });
            setShowOverlay(false);
            setNewName("");
            setNameError("");
        } catch (err) {
            alertError("Error al crear tipo de material", err.message || "Intenta de nuevo.");
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
                        placeholder="Selecciona un tipo de material"
                        required={required}
                    />
                </div>

                {/* Botón "+" */}
                <button
                    type="button"
                    title="Crear nuevo tipo de material"
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

            {/* ── Overlay ── */}
            {showOverlay && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm mx-4 rounded-2xl bg-[#1e1e2e] border border-white/15 shadow-2xl p-6 flex flex-col gap-5">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-[rgba(0,200,220,0.15)]">
                                    <Tag size={18} style={{ color: "#00C8DC" }} />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm leading-tight">Nuevo tipo de material</p>
                                    <p className="text-white/50 text-xs">Se agregará a la lista de tipos</p>
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
                            label="Nombre del tipo de material"
                            placeholder="Ej: Electrónica, Herramientas..."
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
                                {saving ? "Guardando…" : "Crear tipo"}
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
