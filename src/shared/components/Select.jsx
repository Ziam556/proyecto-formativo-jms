export default function Select( {
    name,
    error,
    options = [], 
    value,
    onChange,
    placeholder = "Seleccione una opción"
}){    

    return(
        <div className="w-[320px]"> 

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
                
                    <option key ={opt.id} value={opt.id}>
                        {opt.label}
                    </option>
                ))}

            </select>
                {/* Feedback message */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    )
    
}