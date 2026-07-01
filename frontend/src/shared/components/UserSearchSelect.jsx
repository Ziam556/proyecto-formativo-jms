import { useState, useRef, useEffect } from "react";

// labelVariant="light" → label blanco  (fondos degradado / oscuros)   [default]
// labelVariant="dark"  → label negro   (fondos claros / cards blancas)

/**
 * Selector de usuario con buscador integrado.
 * Reemplaza un <Select> nativo cuando los nombres son largos.
 *
 * Props:
 *  - label        {string}   — etiqueta sobre el campo
 *  - users        {Array}    — [{ user_document_number, user_name }]
 *  - value        {string}   — documento del usuario seleccionado
 *  - onChange     {Function} — (documentNumber: string) => void
 *  - error        {string}   — mensaje de error
 *  - placeholder  {string}   — texto cuando no hay selección
 *  - labelVariant {"light"|"dark"} — color del label (default: "light")
 */
export default function UserSearchSelect({
    label,
    users = [],
    value,
    onChange,
    error,
    placeholder = "Buscar usuario...",
    labelVariant = "light",
}) {
    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";
    const [query, setQuery]     = useState("");
    const [open, setOpen]       = useState(false);
    const containerRef          = useRef(null);

    // Nombre del usuario actualmente seleccionado
    const selectedUser = users.find(
        (u) => String(u.user_document_number) === String(value)
    );

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = users
        .filter((u) => u.user_document_number && u.user_name)
        .filter((u) => {
            const q = query.toLowerCase();
            return (
                u.user_name.toLowerCase().includes(q) ||
                String(u.user_document_number).includes(q)
            );
        });

    const handleSelect = (u) => {
        onChange(String(u.user_document_number));
        setOpen(false);
        setQuery("");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
    };

    return (
        <div className="w-full relative" ref={containerRef}>
            {label && (
                <label className={`block text-[12px] mb-1 place-self-start font-semibold ${labelColor}`}>
                    {label}
                </label>
            )}

            {/* Campo principal */}
            <div
                onClick={() => { setOpen(true); }}
                className={`
                    w-full h-12 px-4 flex items-center justify-between gap-2
                    rounded-[8px] border cursor-text
                    bg-[rgba(217,217,217,0.54)]
                    hover:border-2 hover:border-focus-border
                    ${error ? "border-red-600" : "border-black"}
                `}
            >
                {open ? (
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={selectedUser ? selectedUser.user_name : placeholder}
                        className="flex-1 bg-transparent outline-none text-[0.9rem] text-gray-800 placeholder-gray-400 min-w-0"
                    />
                ) : (
                    <span className={`flex-1 text-[0.9rem] truncate ${selectedUser ? "text-gray-800" : "text-gray-400"}`}>
                        {selectedUser ? selectedUser.user_name : placeholder}
                    </span>
                )}

                {/* Botón limpiar o chevron */}
                {selectedUser && !open ? (
                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer leading-none text-[1rem] shrink-0"
                    >
                        ✕
                    </button>
                ) : (
                    <span className="text-gray-400 text-[0.75rem] shrink-0">▾</span>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg overflow-hidden">
                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "220px" }}
                    >
                        {filtered.length === 0 ? (
                            <p className="px-4 py-3 text-[0.82rem] text-gray-400 text-center">
                                Sin resultados
                            </p>
                        ) : (
                            filtered.map((u) => (
                                <div
                                    key={u.user_document_number}
                                    onClick={() => handleSelect(u)}
                                    className={`px-4 py-[10px] cursor-pointer flex flex-col border-b border-gray-100 last:border-0 hover:bg-purple-50 transition-colors
                                        ${String(u.user_document_number) === String(value) ? "bg-purple-50" : ""}`}
                                >
                                    <span className="text-[0.87rem] font-medium text-gray-800 truncate">
                                        {u.user_name}
                                    </span>
                                    <span className="text-[0.74rem] text-gray-400">
                                        Doc: {u.user_document_number}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-caption text-red-600 place-self-start mt-1">{error}</p>
            )}
        </div>
    );
}
