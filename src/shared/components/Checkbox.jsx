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
            style={{
                width: "16px",
                height: "16px",
                accentColor: "#16a34a",
                cursor: disabled ? "not-allowed" : "pointer",
                flexShrink: 0,
                opacity: disabled ? 0.5 : 1,
            }}
        />
    );
}
