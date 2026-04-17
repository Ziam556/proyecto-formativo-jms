export default function Select({
    label,
    name,
    error,
    options = [],
    value,
    onChange,
    placeholder = "Seleccione una opción"
}){
    return(
        <div className="w-[320px]">

            {/* Label opcional, se pone rojo si hay error */}
            {label && (
                <label className={`block text-caption mb-1 place-self-start ${error ? "text-red-600" : "text-text-secondary"}`}>
                    {label}
                </label>
            )}

            {/* Select con opciones cargadas dinamicamente
                options debe tener formato { id, label }
                el placeholder es la primera opcion deshabilitada */}
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`
                    w-full
                    h-12
                    rounded-md
                    border
                    border-border
                    px-4
                    hover:border-2
                    hover:border-focus-border
                    ${error ? "border-red-600" : "border border-border"} 
                `}
            >
                <option value="">{placeholder}</option>

                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.label}
                    </option>
                ))}

            </select>

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    )
}