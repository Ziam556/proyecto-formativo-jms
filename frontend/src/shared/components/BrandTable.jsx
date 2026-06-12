import { Pencil, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/shared";

export default function BrandTable({ brands = [] }) {
    const [items, setItems] = useState(brands);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    // esto hace que cuando cambie brands desde el padre, se actualice
    useEffect(() => {
        setItems(brands);
    }, [brands]);

    const handleEdit = (i, name) => {
        setEditingIndex(i);
        setEditingValue(name);
    };

    const handleSave = () => {
        const updated = [...items];
        updated[editingIndex] = editingValue;
        setItems(updated);
        setEditingIndex(null);
    };

    return (
        <div className="rounded-xl overflow-hidden flex-1 bg-white">
            <div className="flex justify-between px-4 py-2 bg-gray-200 font-semibold text-sm">
                <span>Marcas registradas</span>
                <span>Estado</span>
            </div>
            {items.map((brand, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-800 flex-1">
                        {editingIndex === i ? (
                            <input
                                autoFocus
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-0.5 text-sm outline-none w-32"
                            />
                        ) : (
                            <span>{brand}</span>
                        )}
                        {editingIndex === i ? (
                            <Save
                                size={16}
                                className="text-green-500 cursor-pointer shrink-0"
                                onClick={handleSave}
                            />
                        ) : (
                            <Pencil
                                size={16}
                                className="text-gray-400 cursor-pointer shrink-0"
                                onClick={() => handleEdit(i, brand)}
                            />
                        )}
                    </div>
                    <Switch checked={true} size="md" />
                </div>
            ))}
        </div>
    );
}