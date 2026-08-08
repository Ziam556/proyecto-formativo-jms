import { useState, useMemo, useEffect } from "react";
import { SearchField, Input, Button, InventoryTable, BackButton } from "@/shared";
import { getInventories, createInventory, updateInventory, toggleInventory } from "../services/inventoryService";

const PAGE_SIZE = 24;

export default function InventoryRegisterForm() {
    const [inventories, setInventories] = useState([]);
    const [newName, setNewName]         = useState("");
    const [search, setSearch]           = useState("");
    const [page, setPage]               = useState(1);
    const [loading, setLoading]         = useState(true);
    const [saving, setSaving]           = useState(false);
    const [error, setError]             = useState(null);

    useEffect(() => {
        getInventories()
            .then(setInventories)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async () => {
        const name = newName.trim();
        if (!name) return;
        try {
            setSaving(true);
            setError(null);
            const inv = await createInventory(name);
            setInventories((prev) => [...prev, inv]);
            setNewName("");
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id, name) => {
        try {
            const updated = await updateInventory(id, name);
            setInventories((prev) => prev.map((i) => (i.id === id ? updated : i)));
        } catch (e) {
            setError(e.message);
        }
    };

    const handleToggle = async (id, enabled) => {
        try {
            const updated = await toggleInventory(id, enabled);
            setInventories((prev) => prev.map((i) => (i.id === id ? updated : i)));
        } catch (e) {
            setError(e.message);
        }
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return inventories;
        return inventories.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [inventories, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const from       = (safePage - 1) * PAGE_SIZE;
    const current    = filtered.slice(from, from + PAGE_SIZE);

    const col1 = current.slice(0, 8);
    const col2 = current.slice(8, 16);
    const col3 = current.slice(16, 24);

    const navButtons = [
        { label: "|◀", action: () => setPage(1),                disabled: safePage === 1 },
        { label: "◀",  action: () => setPage((p) => p - 1),     disabled: safePage === 1 },
        { label: "▶",  action: () => setPage((p) => p + 1),     disabled: safePage === totalPages },
        { label: "▶|", action: () => setPage(totalPages),       disabled: safePage === totalPages },
    ];

    return (
        <div className="mt-4 border border-white bg-app-gradient w-full rounded-3xl grid grid-cols-1 lg:grid-cols-[260px_1fr] overflow-hidden">

            {/* ── Panel izquierdo ─────────────────────────── */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-white bg-brand flex flex-col gap-4">

                <BackButton />

                <div className="text-white font-bold mt-2">Agregar inventario</div>

                <Input
                    placeholder="Nombre del inventario"
                    label="Nombre de inventario"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />

                {error && (
                    <p className="text-red-300 text-sm">{error}</p>
                )}

                <Button variant="secondary" onClick={handleAdd} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            {/* ── Panel derecho ──────────────────────────────────────────── */}
            <div className="flex flex-col p-4 sm:p-6 gap-4 flex-1 min-w-0">

                <SearchField
                    placeholder="Buscar inventario..."
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    fullWidth
                />

                {loading ? (
                    <p className="text-white text-center py-8">Cargando inventarios...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <InventoryTable inventories={col1} onUpdate={handleUpdate} onToggle={handleToggle} />
                        <InventoryTable inventories={col2} onUpdate={handleUpdate} onToggle={handleToggle} />
                        <InventoryTable inventories={col3} onUpdate={handleUpdate} onToggle={handleToggle} />
                    </div>
                )}

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
