/**
 * @file UserOverlays.jsx
 * @description Modales específicos del módulo de usuarios.
 * Usan el componente <Modal> de shared en lugar de replicar la estructura del backdrop.
 */

import { useState } from "react";
import { Input, Button, Modal } from "@/shared";

// ─── Overlay: Asignar Grupo ───────────────────────────────────────────────────
export function GroupOverlay({ groups, selectedId, onConfirm, onClose }) {
    const [tempId, setTempId] = useState(selectedId);
    const enabled = groups.filter((g) => g.enabled);

    return (
        <Modal title="Seleccionar grupo" onClose={onClose}>
            <div className="flex flex-col gap-2 mb-6 max-h-[280px] overflow-y-auto">
                {enabled.map((group) => (
                    <label
                        key={group.id}
                        className={`flex items-center gap-3 p-[10px_14px] rounded-lg cursor-pointer text-white text-[0.9rem] transition-colors duration-200 ${
                            tempId === group.id
                                ? "bg-[rgba(255,255,255,0.4)]"
                                : "bg-[rgba(255,255,255,0.15)]"
                        }`}
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
                <Button onClick={() => onConfirm(tempId)} disabled={!tempId} variant="primary">
                    Confirmar
                </Button>
            </div>
        </Modal>
    );
}

// ─── Overlay: Teléfono secundario ─────────────────────────────────────────────
export function SecondaryPhoneOverlay({ current, onConfirm, onClose }) {
    const [phone, setPhone] = useState(current || "");

    return (
        <Modal title="Número secundario" onClose={onClose}>
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
        </Modal>
    );
}
