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
    value = "",
    onChange,
    placeholder,
    type = "text",
    ...props
}) {
    const isSearch = type === "search";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "320px" }}>

            {/* Label */}
            {label && (
                <label style={{
                    fontSize: "0.75rem",
                    color: "#c4b5fd",
                    fontWeight: 500,
                }}>
                    {label}
                </label>
            )}

            {/* Input wrapper */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

                {/* Ícono búsqueda */}
                {isSearch && (
                    <Search
                        size={15}
                        style={{
                            position: "absolute",
                            left: "12px",
                            color: "#6b7280",
                            pointerEvents: "none",
                            flexShrink: 0,
                        }}
                    />
                )}

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        height: "56px",
                        background: "rgba(217,217,217,0.54)",
                        border: "none",
                        borderRadius: "8px",
                        padding: isSearch ? "0 36px 0 36px" : "0 36px 0 14px",
                        fontSize: "0.85rem",
                        color: "#111",
                        outline: "none",
                        boxSizing: "border-box",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                    }}
                    {...props}
                />

                {/* Botón limpiar — solo si hay valor */}
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange({ target: { value: "" } })}
                        style={{
                            position: "absolute",
                            right: "10px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            padding: 0,
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
