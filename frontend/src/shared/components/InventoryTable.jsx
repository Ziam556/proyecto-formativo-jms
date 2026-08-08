import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/shared";

// inventories = [{ id, name, enabled }]
// onUpdate(id, name) → llamado cuando se guarda edición
// onToggle(id, enabled) → llamado cuando se cambia el switch
export default function InventoryTable({ inventories = [], onUpdate, onToggle }) {
    const [editingId, setEditingId]       = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const handleEdit = (inv) => {
        setEditingId(inv.id);
        setEditingValue(inv.name);
    };

    const handleSave = async (id) => {
        if (onUpdate) await onUpdate(id, editingValue);
        setEditingId(null);
    };

    return (
        <div className="rounded-xl overflow-hidden flex-1 bg-white min-w-0">
            <div className="flex justify-between px-4 py-2 bg-gray-200 font-semibold text-sm">
                <span>Inventarios registrados</span>
                <span>Estado</span>
            </div>
            {inventories.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-800 flex-1 min-w-0">
                        {editingId === inv.id ? (
                            <input
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSave(inv.id)}
                                className="border border-gray-300 rounded px-2 py-0.5 text-sm outline-none w-full max-w-[160px]"
                            />
                        ) : (
                            <span className="truncate">{inv.name}</span>
                        )}
                        {editingId === inv.id ? (
                            <Save
                                size={16}
                                className="text-green-500 cursor-pointer shrink-0"
                                onClick={() => handleSave(inv.id)}
                            />
                        ) : (
                            <Pencil
                                size={16}
                                className="text-gray-400 cursor-pointer shrink-0"
                                onClick={() => handleEdit(inv)}
                            />
                        )}
                    </div>
                    <Switch
                        checked={inv.enabled}
                        size="md"
                        onChange={() => onToggle && onToggle(inv.id, !inv.enabled)}
                    />
                </div>
            ))}
            {inventories.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 italic">Sin inventarios</div>
            )}
        </div>
    );
}
