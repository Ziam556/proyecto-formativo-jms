import { useRef, useEffect } from "react";

// Checkbox estilizado para selección de filas en tablas.
// Soporta estado indeterminate (cuando solo algunas filas están seleccionadas).
export default function Checkbox({
    checked = false,
    onChange,
    disabled = false,
    indeterminate = false,
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`w-4 h-4 accent-[#16a34a] shrink-0 ${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
        />
    );
}
