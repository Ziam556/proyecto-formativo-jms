// labelVariant="light" → label blanco  (fondos degradado / oscuros)   [default]
// labelVariant="dark"  → label negro   (fondos claros / cards blancas)
export default function Input({
    label,
    type = "text",
    error,
    labelVariant = "light",
    required = false,
    className: extraClassName = "",
    ...props
}){
    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";

    return (
        <div className="w-full">

            {/* Label opcional, se pone rojo si hay error */}
            {label && (
                <label className={`block text-[12px] mb-1 place-self-start font-semibold ${labelColor}`}>
                    {label}{required && <span className="text-red-500 ml-[2px]">*</span>}
                </label>
            )}

            {/* Contenedor del input con altura fija de 48px */}
            <div className="relative h-12 flex items-center">

                {/* Area invisible que redirige el foco al input real
                    se omite en type="date" para no bloquear el calendario nativo */}
                {type !== "date" && (
                    <div 
                        className="absolute inset-0"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.currentTarget.nextSibling.focus();
                        }}
                    />
                )}

                {/* Input real, recibe cualquier prop adicional con ...props */}
                <input
                    type={type}
                    className={`
                        relative
                        w-full
                        h-12
                        rounded-[8px]
                        border
                        px-4
                        text-[12px]
                        bg-[rgba(217,217,217,0.54)]
                        hover:border-2
                        focus:outline-none
                        focus:ring-1
                        focus:ring-focus-ring
                        ${error ? "border-red-600" : "border-black"}
                        ${extraClassName}
                    `}
                    {...props}
                />
            </div>

            <div></div>

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}

        </div>
    );
};