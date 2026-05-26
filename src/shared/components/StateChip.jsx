// Etiqueta de color para representar el estado de un elemento.
const DEFAULT_STYLES = {
    Disponible:      { bg: "#16a34a", color: "#fff" },
    "No Disponible": { bg: "rgba(217,217,217,0.9)", color: "#FDC300" },
    Prestamo:        { bg: "#2563eb", color: "#fff" },
    Baja:            { bg: "#878787", color: "#FFFFFF" },
    Traslado:        { bg: "#9333ea", color: "#fff" },
    Mantenimiento:   { bg: "#878787", color: "#FFFFFF" },
};

export default function StateChip({ value, customStyles = {} }) {
    const styles = { ...DEFAULT_STYLES, ...customStyles };
    const s = styles[value] || { bg: "#6b7280", color: "#fff" };

    return (
        /* El bg y color vienen del dato — se mantienen inline */
        <span
            className="rounded-full py-[3px] px-3 text-[0.78rem] font-semibold whitespace-nowrap"
            style={{ background: s.bg, color: s.color }}
        >
            {value}
        </span>
    );
}
