import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/shared";

// categories = [{ id, name, prefix, enabled }]
// onUpdate(id, name, prefix) → llamado cuando se guarda edición
// onToggle(id, enabled)       → llamado cuando se cambia el switch
export default function CategoryTable({ categories = [], onUpdate, onToggle }) {
    const [editingId, setEditingId]         = useState(null);
    const [editingName, setEditingName]     = useState("");
    const [editingPrefix, setEditingPrefix] = useState("");

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setEditingName(cat.name);
        setEditingPrefix(cat.prefix ?? "");
    };

    const handleSave = async (id) => {
        if (onUpdate) await onUpdate(id, editingName, editingPrefix);
        setEditingId(null);
    };

    return (
        <div className="rounded-xl overflow-hidden flex-1 bg-white min-w-0">
            <div className="flex justify-between px-4 py-2 bg-gray-200 font-semibold text-sm">
                <span>Categorías registradas</span>
                <span>Estado</span>
            </div>
            {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-800 flex-1 min-w-0">
                        {editingId === cat.id ? (
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <input
                                    autoFocus
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSave(cat.id)}
                                    placeholder="Nombre"
                                    className="border border-gray-300 rounded px-2 py-0.5 text-sm outline-none w-full max-w-[140px]"
                                />
                                <input
                                    value={editingPrefix}
                                    onChange={(e) => setEditingPrefix(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleSave(cat.id)}
                                    placeholder="Prefijo (ej: HER)"
                                    maxLength={10}
                                    className="border border-gray-300 rounded px-2 py-0.5 text-xs outline-none w-full max-w-[100px]"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium">{cat.name}</span>
                                {cat.prefix && (
                                    <span className="text-xs text-gray-400">{cat.prefix}</span>
                                )}
                            </div>
                        )}
                        {editingId === cat.id ? (
                            <Save
                                size={16}
                                className="text-green-500 cursor-pointer shrink-0"
                                onClick={() => handleSave(cat.id)}
                            />
                        ) : (
                            <Pencil
                                size={16}
                                className="text-gray-400 cursor-pointer shrink-0"
                                onClick={() => handleEdit(cat)}
                            />
                        )}
                    </div>
                    <Switch
                        checked={cat.enabled}
                        size="md"
                        onChange={() => onToggle && onToggle(cat.id, !cat.enabled)}
                    />
                </div>
            ))}
            {categories.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 italic">Sin categorías</div>
            )}
        </div>
    );
}
