import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

// Registra el idioma español para que el calendario muestre los meses y dias en español
registerLocale("es", es);

export default function DatePicker({
    name,
    placeholder = "Seleccione una fecha",
    value,
    onChange,
    error,
    label,
}) {
    return (
        <div className="w-[320px]">

            {/* Label opcional, se pone rojo si hay error */}
            {label && (
                <label className={`block text-[8px] mb-1 place-self-start ${error ? "text-red-600" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            {/* DatePicker de la libreria react-datepicker
                convierte la fecha seleccionada a formato YYYY-MM-DD
                para que sea compatible con handleChange y los schemas de Zod
                si el valor esta vacio selected recibe null y muestra el placeholder */}
            <ReactDatePicker
                locale="es"
                placeholderText={placeholder}
                selected={value ? new Date(value) : null}
                onChange={(date) =>
                    onChange({
                        target:  {
                            name,
                            value: date ? date.toISOString().split("T")[0] : "",
                        },
                    })
                }
                dateFormat="dd/MM/yyyy"
                className={`
                    w-[320px]
                    h-12
                    rounded-md
                    border
                    border-border
                    px-4
                    text-base
                    hover:border-2
                    hover:border-focus-border
                    focus:outline-none
                    focus:ring-1
                    focus:ring-focus-ring
                    ${error ? "border-red-600" : "border border-border"}
                `}
            />

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}