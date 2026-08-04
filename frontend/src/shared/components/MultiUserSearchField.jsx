import { useState, useEffect } from "react";
import { getUsers } from "@/features/users/services/userService";
import UserSearchSelect from "./UserSearchSelect";
import { X } from "lucide-react";

/**
 * Selector de múltiples cuentadantes.
 * Wrappea UserSearchSelect para permitir selección de varios usuarios.
 * Los seleccionados se muestran como chips con botón de eliminar.
 *
 * Props:
 *  - label        {string}
 *  - value        {Array<{name: string, document: string}>}
 *  - onChange     {Function} — (newArray) => void
 *  - error        {string}
 *  - labelVariant {"light"|"dark"} — default "light"
 *  - required     {boolean}
 */
export default function MultiUserSearchField({
    label        = "Cuentadante(s)",
    value        = [],
    onChange,
    error,
    labelVariant = "light",
    required     = false,
}) {
    const [users, setUsers]           = useState([]);
    const [pickerValue, setPickerValue] = useState(""); // documento del usuario actualmente en el picker

    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";

    useEffect(() => {
        getUsers().then(setUsers).catch(console.error);
    }, []);

    // IDs ya seleccionados (para excluirlos del dropdown)
    const selectedDocs = new Set(value.map((u) => String(u.document)));

    // Usuarios disponibles = todos menos los ya seleccionados
    const availableUsers = users.filter(
        (u) => !selectedDocs.has(String(u.user_document_number))
    );

    const handleSelect = (documentNumber) => {
        if (!documentNumber) return;
        const user = users.find(
            (u) => String(u.user_document_number) === String(documentNumber)
        );
        if (!user) return;
        const next = [
            ...value,
            { name: user.user_name, document: String(user.user_document_number) },
        ];
        onChange(next);
        setPickerValue(""); // reset el picker para el siguiente
    };

    const handleRemove = (doc) => {
        onChange(value.filter((u) => String(u.document) !== String(doc)));
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className={`text-[12px] font-semibold ${labelColor}`}>
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            {/* Picker — solo muestra usuarios no seleccionados */}
            <UserSearchSelect
                users={availableUsers}
                value={pickerValue}
                onChange={handleSelect}
                onUserSelect={() => {}}
                placeholder="Buscar y agregar cuentadante..."
                labelVariant={labelVariant}
                error={value.length === 0 ? error : undefined}
            />

            {/* Chips de seleccionados */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {value.map((u) => (
                        <span
                            key={u.document}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600/80 text-white text-[0.75rem] font-medium"
                        >
                            {u.name}
                            <button
                                type="button"
                                onClick={() => handleRemove(u.document)}
                                className="ml-1 text-white/70 hover:text-white leading-none"
                                title="Quitar"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Error solo cuando no hay ningún seleccionado */}
            {error && value.length === 0 && (
                <p className="text-red-600 text-[0.75rem] mt-0.5">{error}</p>
            )}
        </div>
    );
}
