import { Check, X } from "lucide-react";

// Toggle para encabezados de columna en tablas.
// Por defecto activo (✓ verde). Al hacer clic se desactiva (✗ amarillo).
// Indica si la columna se incluye o no en el reporte.
export default function ColumnToggle({ label, active = true, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange?.(!active)}
            className="inline-flex items-center gap-[5px] bg-transparent border-0 cursor-pointer p-0 whitespace-nowrap"
        >
            {/* Icono de estado — el color de fondo varía según estado, se mantiene inline */}
            <span
                className="flex items-center justify-center w-4 h-4 rounded-[4px] shrink-0 transition-colors duration-150"
                style={{ background: active ? "#16a34a" : "#FDC300" }}
            >
                {active
                    ? <Check size={11} color="#000000" strokeWidth={3} />
                    : <X size={11} color="#000000" strokeWidth={3} />
                }
            </span>

            {/* Etiqueta — el color también varía según estado */}
            <span
                className="text-[0.8rem] font-semibold transition-colors duration-150"
                style={{ color: active ? "#000000" : "#3D3D3D" }}
            >
                {label}
            </span>
        </button>
    );
}
