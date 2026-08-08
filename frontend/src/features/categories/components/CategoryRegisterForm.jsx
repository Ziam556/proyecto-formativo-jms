import { useState, useMemo, useEffect } from "react";
import { SearchField, Input, Button, CategoryTable, BackButton } from "@/shared";
import { getCategories, createCategory, updateCategory, toggleCategory } from "../services/categoryService";

const PAGE_SIZE = 24;

export default function CategoryRegisterForm() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName]       = useState("");
    const [newPrefix, setNewPrefix]   = useState("");
    const [search, setSearch]         = useState("");
    const [page, setPage]             = useState(1);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [error, setError]           = useState(null);

    // ── Cargar categorías desde el backend ──────────────────────────────────
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // ── Agregar categoría ───────────────────────────────────────────────────
    const handleAdd = async () => {
        const name = newName.trim();
        if (!name) return;
        try {
            setSaving(true);
            setError(null);
            const cat = await createCategory(name, newPrefix.trim().toUpperCase());
            setCategories((prev) => [...prev, cat]);
            setNewName("");
            setNewPrefix("");
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Editar nombre/prefix ────────────────────────────────────────────────
    const handleUpdate = async (id, name, prefix) => {
        try {
            const updated = await updateCategory(id, name, prefix);
            setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        } catch (e) {
            setError(e.message);
        }
    };

    // ── Cambiar estado enabled ──────────────────────────────────────────────
    const handleToggle = async (id, enabled) => {
        try {
            const updated = await toggleCategory(id, enabled);
            setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        } catch (e) {
            setError(e.message);
        }
    };

    // ── Filtrado y paginación ───────────────────────────────────────────────
    const filtered = useMemo(() => {
        if (!search.trim()) return categories;
        return categories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [categories, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const from       = (safePage - 1) * PAGE_SIZE;
    const current    = filtered.slice(from, from + PAGE_SIZE);

    const col1 = current.slice(0, 8);
    const col2 = current.slice(8, 16);
    const col3 = current.slice(16, 24);

    const navButtons = [
        { label: "|◀", action: () => setPage(1),              disabled: safePage === 1 },
        { label: "◀",  action: () => setPage((p) => p - 1),   disabled: safePage === 1 },
        { label: "▶",  action: () => setPage((p) => p + 1),   disabled: safePage === totalPages },
        { label: "▶|", action: () => setPage(totalPages),     disabled: safePage === totalPages },
    ];

    return (
        <div className="mt-4 border border-white bg-app-gradient w-full rounded-3xl grid grid-cols-1 lg:grid-cols-[280px_1fr] overflow-hidden">

            {/* ── Panel izquierdo (agregar categoría) ─────────────────────── */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-white bg-brand flex flex-col gap-4">

                <BackButton />

                <div className="text-white font-bold mt-2">Agregar categorías</div>

                <Input
                    placeholder="Escribe el nombre"
                    label="Nombre de la categoría"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />

                <Input
                    placeholder="Ej: HER, MUE, EQU"
                    label="Prefijo (para ID automático)"
                    value={newPrefix}
                    onChange={(e) => setNewPrefix(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    maxLength={10}
                />

                {error && (
                    <p className="text-red-300 text-sm">{error}</p>
                )}

                <Button variant="secondary" onClick={handleAdd} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            {/* ── Panel derecho (listado) ──────────────────────────────────── */}
            <div className="flex flex-col p-4 sm:p-6 gap-4 flex-1 min-w-0">

                <SearchField
                    placeholder="Buscar categoría..."
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    fullWidth
                />

                {loading ? (
                    <p className="text-white text-center py-8">Cargando categorías...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <CategoryTable categories={col1} onUpdate={handleUpdate} onToggle={handleToggle} />
                        <CategoryTable categories={col2} onUpdate={handleUpdate} onToggle={handleToggle} />
                        <CategoryTable categories={col3} onUpdate={handleUpdate} onToggle={handleToggle} />
                    </div>
                )}

                {/* Paginación */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <span className="text-white text-sm">Página</span>
                    {navButtons.map(({ label, action, disabled }) => (
                        <button
                            key={label}
                            onClick={action}
                            disabled={disabled}
                            className={`px-2 py-1 rounded text-xs font-semibold transition-colors
                                ${disabled
                                    ? "bg-white/20 text-white/40 cursor-not-allowed"
                                    : "bg-white/75 text-gray-700 cursor-pointer hover:bg-white"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                    <span className="text-white text-sm">
                        {filtered.length === 0
                            ? "0"
                            : `${from + 1}–${Math.min(from + PAGE_SIZE, filtered.length)}`
                        } de {filtered.length}
                    </span>
                </div>
            </div>
        </div>
    );
}
