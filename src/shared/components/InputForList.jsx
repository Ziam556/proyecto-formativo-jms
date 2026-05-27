import { Search, X } from "lucide-react";

// Input para vistas de listado.
// Apariencia: fondo D9D9D9 al 54%, sin borde visible, radio 4, alto 56px.
//
// Props:
//   label       — texto del label superior
//   value       — valor controlado
//   onChange    — callback de cambio
//   placeholder — placeholder del input
//   type        — "text" (default) | "search" (agrega ícono lupa + botón limpiar)
//   ...props    — cualquier prop nativa del input

export default function InputForList({
    label,
    labelClassName,
    value = "",
    onChange,
    placeholder,
    type = "text",
    ...props
}) {
    const isSearch = type === "search";

    return (
        <div className="flex flex-col gap-1 w-[320px]">

            {/* Label */}
            {label && (
                <label className={`text-white text-[0.75rem] font-medium ${labelClassName ?? ""}`}>
                    {label}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative flex items-center">

                {/* Ícono búsqueda */}
                {isSearch && (
                    <Search
                        size={15}
                        className="absolute left-3 text-gray-500 pointer-events-none shrink-0"
                    />
                )}

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full h-14 bg-[rgba(217,217,217,0.54)] border-0 rounded-lg text-[0.85rem] text-[#111] outline-none box-border backdrop-blur-sm ${isSearch ? "pl-9 pr-9" : "pl-[14px] pr-9"}`}
                    {...props}
                />

                {/* Botón limpiar — solo si hay valor */}
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange({ target: { value: "" } })}
                        className="absolute right-[10px] bg-transparent border-0 cursor-pointer text-gray-500 flex items-center p-0"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
