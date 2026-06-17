import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/shared";

// brands = [{ id, name, enabled }]
// onUpdate(id, newName) → llamado cuando se guarda edición
// onToggle(id, enabled) → llamado cuando se cambia el switch
export default function BrandTable({ brands = [], onUpdate, onToggle }) {
    const [editingId, setEditingId]       = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const handleEdit = (brand) => {
        setEditingId(brand.id);
        setEditingValue(brand.name);
    };

    const handleSave = async (id) => {
        if (onUpdate) await onUpdate(id, editingValue);
        setEditingId(null);
    };

    return (
        <div className="rounded-xl overflow-hidden flex-1 bg-white min-w-0">
            <div className="flex justify-between px-4 py-2 bg-gray-200 font-semibold text-sm">
                <span>Marcas registradas</span>
                <span>Estado</span>
            </div>
            {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-800 flex-1 min-w-0">
                        {editingId === brand.id ? (
                            <input
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSave(brand.id)}
                                className="border border-gray-300 rounded px-2 py-0.5 text-sm outline-none w-full max-w-[120px]"
                            />
                        ) : (
                            <span className="truncate">{brand.name}</span>
                        )}
                        {editingId === brand.id ? (
                            <Save
                                size={16}
                                className="text-green-500 cursor-pointer shrink-0"
                                onClick={() => handleSave(brand.id)}
                            />
                        ) : (
                            <Pencil
                                size={16}
                                className="text-gray-400 cursor-pointer shrink-0"
                                onClick={() => handleEdit(brand)}
                            />
                        )}
                    </div>
                    <Switch
                        checked={brand.enabled}
                        size="md"
                        onChange={() => onToggle && onToggle(brand.id, !brand.enabled)}
                    />
                </div>
            ))}
            {brands.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 italic">Sin marcas</div>
            )}
        </div>
    );
}
