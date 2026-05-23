import { Check, X } from "lucide-react";

// Toggle para encabezados de columna en tablas.
// Por defecto activo (✓ verde). Al hacer clic se desactiva (✗ amarillo).
// Indica si la columna se incluye o no en el reporte.
export default function ColumnToggle({ label, active = true, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange?.(!active)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                whiteSpace: "nowrap",
            }}
        >
            {/* Icono de estado */}
            <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                flexShrink: 0,
                background: active ? "#16a34a" : "#FDC300",
                transition: "background 0.15s",
            }}>
                {active
                    ? <Check size={11} color="#000000" strokeWidth={3} />
                    : <X size={11} color="#000000" strokeWidth={3} />
                }
            </span>

            {/* Etiqueta */}
            <span style={{
                color: active ? "#000000" : "#3D3D3D",
                fontSize: "0.8rem",
                fontWeight: 600,
                transition: "color 0.15s",
            }}>
                {label}
            </span>
        </button>
    );
}
