export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    className: extraClassName = "",
    ...props
}){
    const variants = {
        primary:   "text-white",
        secondary: "text-black",
        outline:   "text-[#00C8DC]",
    }

    const sizes = {
        sm: "h-10 px-6",
        md: "h-12 px-8",
    }

    const bgClasses = {
        primary:   "bg-[#71277A] rounded-full w-full lg:w-auto",
        secondary: "bg-[#00C8DC] rounded-full w-full lg:w-auto",
        outline:   "bg-transparent border-2 border-[#00C8DC] rounded-full w-full lg:w-auto hover:bg-[rgba(0,200,220,0.08)]",
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