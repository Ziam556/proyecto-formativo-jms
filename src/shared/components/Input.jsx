export default function Input({
    label,
    type = "text",
    error,
    ...props
}){
    return (
        <div className="w-[320px]">

            {/* Label opcional, se pone rojo si hay error */}
            {label && (
                <label
                    className={`
                        block
                        text-[8px]
                        mb-1
                        place-self-start
                        ${error ? "text-red-600" : "text-text-primary"}
                    `}>
                    {label}
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
                        rounded-md
                        border
                        px-4
                        text-base
                        hover:border-2
                        focus:outline-none
                        focus:ring-1
                        focus:ring-focus-ring
                        ${error ? "border-red-600" : "border-black"}      
                    `}
                    style={{
                        background: "rgba(217,217,217,0.54)",  // D9D9D9 al 54%
                        border: error ? "1px solid red" : "1px solid #000000",  // negro 100%
                        borderRadius: "8px",  // corner radius 8
                    }}
                    {...props}
                />
            </div>

            <div></div>

            {/* Mensaje de error visible solo si hay error */}
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}

        </div>
    );
};