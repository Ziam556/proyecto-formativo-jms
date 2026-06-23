import { useState } from "react";
import { X } from "lucide-react";
import { Input, Button } from "@/shared";

// ─── Overlay: Asignar Grupo ────────────────────────────────────────────────
export function GroupOverlay({ groups, selectedId, onConfirm, onClose }) {
    const [tempId, setTempId] = useState(selectedId);
    const enabled = groups.filter((g) => g.enabled);

    return (
        <div
            className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.55)] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-2xl p-8 min-w-[320px] max-w-[420px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white m-0 text-[1.1rem] font-semibold">
                        Seleccionar grupo
                    </h3>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-2 mb-6 max-h-[280px] overflow-y-auto">
                    {enabled.map((group) => (
                        <label
                            key={group.id}
                            className={`flex items-center gap-3 p-[10px_14px] rounded-lg cursor-pointer text-white text-[0.9rem] transition-colors duration-200 ${tempId === group.id ? "bg-[rgba(255,255,255,0.4)]" : "bg-[rgba(255,255,255,0.15)]"}`}
                        >
                            <input
                                type="radio"
                                name="groupSelect"
                                value={group.id}
                                checked={tempId === group.id}
                                onChange={() => setTempId(group.id)}
                                className="accent-[#50E5F9] w-4 h-4"
                            />
                            {group.name}
                        </label>
                    ))}
                </div>

                <div className="flex gap-3 justify-end">
                    <Button onClick={onClose} variant="secondary">Cancelar</Button>
                    <Button onClick={() => onConfirm(tempId)} disabled={!tempId} variant="primary">Confirmar</Button>
                </div>
            </div>
        </div>
    );
}

// ─── Overlay: Teléfono secundario ─────────────────────────────────────────
export function SecondaryPhoneOverlay({ current, onConfirm, onClose }) {
    const [phone, setPhone] = useState(current || "");

    return (
        <div
            className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.55)] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-2xl p-8 min-w-[320px] max-w-[420px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white m-0 text-[1.1rem] font-semibold">
                        Número secundario
                    </h3>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-white">
                        <X size={20} />
                    </button>
                </div>

                {current && (
                    <p className="text-[rgba(255,255,255,0.75)] text-[0.8rem] mb-3">
                        Actual: <strong>{current}</strong>
                    </p>
                )}

                <Input
                    label="Número telefónico secundario"
                    name="secondaryPhone"
                    type="tel"
                    placeholder="Ingrese el número secundario"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <div className="flex gap-3 justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => onConfirm(phone)} variant="primary">Guardar</Button>
                </div>
            </div>
        </div>
    );
}
