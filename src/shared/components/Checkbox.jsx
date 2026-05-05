export default function Checkbox ({
    id,                 // Identificador unico (necesario para accesibilidad)
    name,               // Nombre del campo (Util para formulario)
    label,              // Texto visible asociado al chec,box
    checked = false,    // Estado controlado del checkbox 
    onChange,           // Funcion que maneja el cambio de estado
    disabled = false,    // Indica si el checkbox esta habilitado
    className = "",     // Clases adicionales para personalizacion
}){

    return (
        <label
            htmlFor={id}
            className={`
                flex items-center gap-2
                text-sm 
                cursor-pointer
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${className}
            `}
        >
            {/* Input del checkbox */}
            <input 
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="w-5 h-5"
            />

            {/* Texto del checkbox */}
            <span>{label}</span>

        </label>
    );
}