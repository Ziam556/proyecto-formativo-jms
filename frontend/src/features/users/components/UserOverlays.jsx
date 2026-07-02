/**
 * @file UserOverlays.jsx
 * @description Modales específicos del módulo de usuarios.
 * Usan el componente <Modal> de shared en lugar de replicar la estructura del backdrop.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Input, Button, Modal, SearchField, IconButton } from "@/shared";

// Grupos predeterminados: siempre se muestran primero, en este orden.
const DEFAULT_GROUP_NAMES = ["Administrador", "Instructor", "Invitado"];

function GroupOption({ group, selected, onSelect }) {
    return (
        <label
            className={`flex items-center gap-3 p-[10px_14px] rounded-lg cursor-pointer text-white text-[0.9rem] transition-colors duration-200 ${
                selected
                    ? "bg-[rgba(255,255,255,0.4)]"
                    : "bg-[rgba(255,255,255,0.15)]"
            }`}
        >
            <input
                type="radio"
                name="groupSelect"
                value={group.id}
                checked={selected}
                onChange={onSelect}
                className="accent-[#50E5F9] w-4 h-4"
            />
            {group.name}
        </label>
    );
}

// ─── Overlay: Asignar Grupo ───────────────────────────────────────────────────
export function GroupOverlay({ groups, selectedId, onConfirm, onClose }) {
    const navigate = useNavigate();
    const [tempId, setTempId] = useState(selectedId);
    const [search, setSearch] = useState("");

    const goToCreateGroup = () => {
        onClose();
        navigate("/dashboard/config/groups/create");
    };

    const enabled = groups.filter((g) => g.enabled);

    // Los 3 predeterminados, en orden fijo (solo si existen en la BD)
    const defaultGroups = DEFAULT_GROUP_NAMES
        .map((name) => enabled.find((g) => g.name === name))
        .filter(Boolean);
    const defaultIds = new Set(defaultGroups.map((g) => g.id));

    // El resto de los grupos, filtrados por el buscador
    const query = search.trim().toLowerCase();
    const otherGroups = enabled
        .filter((g) => !defaultIds.has(g.id))
        .filter((g) => !query || g.name.toLowerCase().includes(query));

    return (
        <Modal title="Seleccionar grupo" onClose={onClose}>
            {/* Predeterminados */}
            <div className="flex flex-col gap-2 mb-4">
                {defaultGroups.map((group) => (
                    <GroupOption
                        key={group.id}
                        group={group}
                        selected={tempId === group.id}
                        onSelect={() => setTempId(group.id)}
                    />
                ))}
            </div>

            {/* Raya divisoria */}
            <div className="h-px bg-white/20 mb-4" />

            {/* Buscador de otros grupos */}
            <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Buscar otros grupos..."
                fullWidth
                variant="outlined"
                className="!border-white/20 mb-3 [&_input]:!text-white [&_input::placeholder]:!text-white/50 [&_svg]:!text-white/60"
            />

            {/* Resto de grupos */}
            <div className="flex flex-col gap-2 mb-6 max-h-[180px] overflow-y-auto">
                {otherGroups.length === 0 ? (
                    <p className="text-white/50 text-[0.8rem] text-center py-3">
                        {query ? "Sin resultados." : "No hay más grupos registrados."}
                    </p>
                ) : (
                    otherGroups.map((group) => (
                        <GroupOption
                            key={group.id}
                            group={group}
                            selected={tempId === group.id}
                            onSelect={() => setTempId(group.id)}
                        />
                    ))
                )}
            </div>

            <div className="flex gap-3 justify-end items-center">
                <IconButton
                    ariaLabel="Crear nuevo grupo"
                    onClick={goToCreateGroup}
                    hitSize={48}
                    iconSize={20}
                    className="rounded-full border border-white/20 text-white hover:bg-white/10"
                >
                    <Plus size={20} />
                </IconButton>
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
