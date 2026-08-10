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
    onUserSelect,
    error,
    placeholder = "Buscar usuario...",
    labelVariant = "light",
    fieldVariant = "light",   // "light" | "dark"
}) {
    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";

    const isDark = fieldVariant === "dark";
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
        onUserSelect?.(u);
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
                    rounded-[8px] border cursor-text transition-colors
                    ${isDark
                        ? `bg-white/10 hover:border-purple-400 ${error ? "border-red-500" : "border-white/30"}`
                        : `bg-[rgba(217,217,217,0.54)] hover:border-2 hover:border-focus-border ${error ? "border-red-600" : "border-black"}`
                    }
                `}
            >
                {open ? (
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={selectedUser ? selectedUser.user_name : placeholder}
                        className={`flex-1 bg-transparent outline-none text-[0.9rem] min-w-0
                            ${isDark ? "text-white placeholder-white/40" : "text-gray-800 placeholder-gray-400"}`}
                    />
                ) : (
                    <span className={`flex-1 text-[0.9rem] truncate
                        ${isDark
                            ? selectedUser ? "text-white" : "text-white/40"
                            : selectedUser ? "text-gray-800" : "text-gray-400"
                        }`}>
                        {selectedUser ? selectedUser.user_name : placeholder}
                    </span>
                )}

                {/* Botón limpiar o chevron */}
                {selectedUser && !open ? (
                    <button
                        onClick={handleClear}
                        className={`bg-transparent border-0 cursor-pointer leading-none text-[1rem] shrink-0
                            ${isDark ? "text-white/40 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        ✕
                    </button>
                ) : (
                    <span className={`text-[0.75rem] shrink-0 ${isDark ? "text-white/40" : "text-gray-400"}`}>▾</span>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className={`absolute z-[9999] w-full mt-1 rounded-[10px] shadow-lg overflow-hidden border
                    ${isDark
                        ? "bg-[#1e1535] border-white/15"
                        : "bg-white border-gray-200"
                    }`}>
                    <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
                        {filtered.length === 0 ? (
                            <p className={`px-4 py-3 text-[0.82rem] text-center ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                Sin resultados
                            </p>
                        ) : (
                            filtered.map((u) => (
                                <div
                                    key={u.user_document_number}
                                    onClick={() => handleSelect(u)}
                                    className={`px-4 py-[10px] cursor-pointer flex flex-col border-b last:border-0 transition-colors
                                        ${isDark
                                            ? `border-white/10 hover:bg-purple-600/30 ${String(u.user_document_number) === String(value) ? "bg-purple-600/20" : ""}`
                                            : `border-gray-100 hover:bg-purple-50 ${String(u.user_document_number) === String(value) ? "bg-purple-50" : ""}`
                                        }`}
                                >
                                    <span className={`text-[0.87rem] font-medium truncate ${isDark ? "text-white" : "text-gray-800"}`}>
                                        {u.user_name}
                                    </span>
                                    <span className={`text-[0.74rem] ${isDark ? "text-white/50" : "text-gray-400"}`}>
                                        Doc: {u.user_document_number}
                                    </span>
                                    {u.user_email && (
                                        <span className={`text-[0.72rem] truncate ${isDark ? "text-white/40" : "text-gray-400"}`}>
                                            {u.user_email}
                                        </span>
                                    )}
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
