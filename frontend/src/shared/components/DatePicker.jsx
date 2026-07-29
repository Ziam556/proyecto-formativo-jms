import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

// Registra el idioma español para que el calendario muestre los meses y dias en español
registerLocale("es", es);

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

    return (
        <div className={`w-full ${disabled ? "opacity-75 pointer-events-none" : ""}`}>

            {/* Label opcional, se pone rojo si hay error */}
            {label && (
                <label className={`block text-[12px] mb-1 place-self-start font-semibold ${labelColor}`}>
                    {label}{required && <span className="text-red-500 ml-[2px]">*</span>}
                </label>
            )}

            {/* DatePicker de la libreria react-datepicker
                convierte la fecha seleccionada a formato YYYY-MM-DD
                para que sea compatible con handleChange y los schemas de Zod
                si el valor esta vacio selected recibe null y muestra el placeholder */}
            <ReactDatePicker
                locale="es"
                placeholderText={placeholder}
                selected={value ? new Date(`${value}T00:00:00`) : null}
                onChange={(date) => {
                    if (!date) { onChange({ target: { name, value: "" } }); return; }
                    const yyyy = date.getFullYear();
                    const mm   = String(date.getMonth() + 1).padStart(2, "0");
                    const dd   = String(date.getDate()).padStart(2, "0");
                    onChange({ target: { name, value: `${yyyy}-${mm}-${dd}` } });
                }}
                dateFormat="dd/MM/yyyy"
                disabled={disabled}
                maxDate={maxDate}
                minDate={minDate}
                wrapperClassName="w-full"
                className={`w-full h-12 px-4 text-[12px] focus:outline-none bg-[rgba(217,217,217,0.54)] rounded-[8px] border ${error ? "border-red-500" : "border-black"} ${disabled ? "cursor-not-allowed" : ""}`}
            />

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}