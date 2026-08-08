// Etiqueta de color para representar el estado de un elemento.
const DEFAULT_CLASSES = {
    Disponible:      "bg-green-600 text-white",
    "No disponible": "bg-[rgba(217,217,217,0.9)] text-[#FDC300]",
    "En préstamo":   "bg-blue-600 text-white",
    Baja:            "bg-[#878787] text-white",
    Traslado:        "bg-purple-600 text-white",
    Mantenimiento:   "bg-[#878787] text-white",
    Deshabilitado:   "bg-[#64748b] text-white",
};

export default function StateChip({ value, customClasses = {} }) {
    const allClasses = { ...DEFAULT_CLASSES, ...customClasses };
    const chipClass = allClasses[value] || "bg-[#6b7280] text-white";

    return (
        <span
            className={`rounded-full py-[3px] px-3 text-[0.78rem] font-semibold whitespace-nowrap ${chipClass}`}
        >
            {value}
        </span>
    );
}
