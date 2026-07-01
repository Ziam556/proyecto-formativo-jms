import { useState, useEffect } from "react";
import UserSearchSelect from "./UserSearchSelect";
import { getUsers } from "@/features/users/services/userService";

// labelVariant="light" → label blanco  (fondos degradado / oscuros)   [default]
// labelVariant="dark"  → label negro   (fondos claros / cards blancas)

/**
 * Buscador de usuarios auto-contenido.
 * Carga la lista de usuarios internamente y renderiza UserSearchSelect.
 *
 * Props (mismas que UserSearchSelect, sin `users`):
 *  - label        {string}
 *  - value        {string}   — documento del usuario seleccionado
 *  - onChange     {Function} — (documentNumber: string) => void
 *  - error        {string}
 *  - placeholder  {string}
 *  - labelVariant {"light"|"dark"} — color del label (default: "light")
 */
export default function UserSearchField({
    label        = "Usuario solicitante",
    value,
    onChange,
    error,
    placeholder  = "Buscar por nombre o documento...",
    labelVariant = "light",
}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(console.error);
    }, []);

    return (
        <UserSearchSelect
            label={label}
            users={users}
            value={value}
            onChange={onChange}
            error={error}
            placeholder={placeholder}
            labelVariant={labelVariant}
        />
    );
}
