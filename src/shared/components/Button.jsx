// Componente boton

// Boton reutiliable con variantes visuales y tamaños controlados, area intectiva minima de 48px

export default function Button({
    variant = "primary", //Define el estilo visual
    size = "md", //Define el tamaño visual
    type = "button", //Tipos de boton (button, submit, reset)
    children,       //Contenido interno del boton(texto, icono)
    ...props        //Propiedades adicionales(OnClick, disable, etc)
}){

    const variants = {
        primary: "text-brand border text-body hover:bg-surface-muted hover:text-text-inverse",
        secondary: "bg-background border border-border hover:bg-surface-muted hover:text-text-inverse   "
    } 
    
    const sizes = {
        sm:`
            h-9 px-3
            before:absolute before:content['']
            before:-inset-y-[6px] before:-inset-x-[0px]
        
        `,
        md:`
            h-10 px-3
            before:absolute before:content['']
            before:-inset-y-[7px] before:-inset-x-[0px]
        
        `
    }

    return(
        <button
            className={`
                relative
                inline-flex items-center justify-center
                rounded-md
                transition-colors
                ${variants[variant]}
                ${sizes[size]}
                ${type}
            `}
            {...props}
            >

            {children}        

        </button>
    )

}