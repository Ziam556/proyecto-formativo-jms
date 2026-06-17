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
        sm: "h-12 px-6",   // secundario: 240×48
        md: "h-14 px-8",   // primario: 320×56
    }

    const bgClasses = {
        primary: "bg-[#71277A] rounded-full w-full lg:w-auto lg:min-w-[320px]",
        secondary: "bg-[#00C8DC] rounded-full w-full lg:w-auto lg:min-w-[240px]",
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
