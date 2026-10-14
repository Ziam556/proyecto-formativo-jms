// DatePicker.jsx — reemplaza react-datepicker con <input type="date"> nativo.
// Mismo API externo: value = "YYYY-MM-DD" | "", onChange simula evento sintético.
// Elimina la incompatibilidad react-datepicker v9 + React 19 (loop en setPreSelection).

// labelVariant="light" → label blanco  (fondos degradado / oscuros)   [default]
// labelVariant="dark"  → label negro   (fondos claros / cards blancas)
export default function DatePicker({
    name,
    placeholder = "Seleccione una fecha",
    value,
    onChange,
    error,
    label,
    labelVariant = "light",
    disabled = false,
    maxDate,
    minDate,
    required = false,
}) {
    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";

    // Convierte un Date a "YYYY-MM-DD" para los atributos min/max del input
    const toIso = (d) => {
        if (!d) return undefined;
        if (typeof d === "string") return d;
        const yyyy = d.getFullYear();
        const mm   = String(d.getMonth() + 1).padStart(2, "0");
        const dd   = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Normaliza cualquier formato de fecha a "YYYY-MM-DD" para el input nativo.
    // Acepta: "", undefined, "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.sssZ", Date object.
    const normalizeValue = (v) => {
        if (!v) return "";
        if (v instanceof Date) return toIso(v);
        if (typeof v === "string") return v.includes("T") ? v.split("T")[0] : v;
        return "";
    };

    const handleChange = (e) => {
        onChange({ target: { name, value: e.target.value } });
    };

    return (
        <div className={`w-full ${disabled ? "opacity-75 pointer-events-none" : ""}`}>

            {label && (
                <label className={`block text-[12px] mb-1 place-self-start font-semibold ${labelColor}`}>
                    {label}{required && <span className="text-red-500 ml-[2px]">*</span>}
                </label>
            )}

            <input
                type="date"
                name={name}
                value={normalizeValue(value)}
                onChange={handleChange}
                disabled={disabled}
                max={toIso(maxDate)}
                min={toIso(minDate)}
                placeholder={placeholder}
                className={`w-full h-12 px-4 text-[12px] focus:outline-none bg-[rgba(217,217,217,0.54)] rounded-[8px] border hover:border-2 focus:ring-1 focus:ring-focus-ring ${error ? "border-red-500" : "border-black"} ${disabled ? "cursor-not-allowed" : ""}`}
            />

            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}
