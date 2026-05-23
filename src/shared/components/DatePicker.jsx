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
                        target: {
                            name,
                            value: date ? date.toISOString().split("T")[0] : "",
                        },
                    })
                }
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-[320px]"
                className="w-[320px] h-12 px-4 text-base focus:outline-none"
                // estilos inline directo
                style={{
                    background: "rgba(217,217,217,0.54)",
                    border: error ? "1px solid red" : "1px solid #000000",
                    borderRadius: "8px",
                    width: "320px",
                    height: "48px",
                    padding: "0 16px",
                    fontSize: "1rem",
                }}
            />

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}