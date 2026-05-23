export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
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

    const bgStyles = {
        primary: {
            background: "#71277A",
            borderRadius: "999px",
            minWidth: "320px",
        },
        secondary: {
            background: "#00C8DC",  // cyan
            borderRadius: "999px",
            minWidth: "240px",
        },
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
            `}
            style={bgStyles[variant]}
            {...props}
        >
            {children}        
        </button>
    )
}