export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    className: extraClassName = "",
    ...props
}){
    const variants = {
        // morado con texto blanco
        primary: "text-white",
        // cyan con texto negro
        secondary: "text-black",
    }

    const sizes = {
        sm: "h-10 px-6",   // secundario: 240×48
        md: "h-12 px-8",   // primario: 320×56
    }

    const bgClasses = {
        primary: "bg-[#71277A] rounded-full w-full lg:w-auto",
        secondary: "bg-[#00C8DC] rounded-full w-full lg:w-auto ",
    }

    return(
        <button
            type={type}
            className={`
                inline-flex items-center justify-center
                font-semibold
                transition-opacity
                hover:opacity-85
                ${variants[variant]}
                ${sizes[size]}
                ${bgClasses[variant]}
                ${extraClassName}
            `}
            {...props}
        >
            {children}
        </button>
    )
}
