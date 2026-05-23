import { useState, useEffect } from "react";

import { Check, X,  } from "lucide-react";

// Componente reutilizable para representar un switch de estado (activo/inactivo)
export default function Switch({
    checked = false,    //valor inicial del switch (controlado desde el padre)
    onChange,           // callback que se ejecuta cuando el estado
    disabled = false,   //permite deshabilitar la interaccion
    size = "md",        //tamaño del switch (sm, md, lg)
    className,
}) {

    //Estado interno del componente
    //Se inicializa con el valor recibido desde la prop "checked"
    const [isActive, setIsActive] = useState(checked);

    //Efecto que sincroniza el estado interno
    //con el valor recibido desde el componente padre
    useEffect(() => {
        setIsActive(checked);
    }, [checked]);//se ejecuta cada vez que cambia "checked"

    //Funcion que maneja el cambio del switch
    const handleToggle = () => {

        //si el switch esta deshabilitado no permite interaccion
        if (disabled) return;

        //calcula el nuevo estado (invierte el valor actual)
        const newValue = !isActive;

        //Actualiza el estado interno
        setIsActive(newValue);

        //Si existe un callback onChange, se ejecuta
        // enviando el nuevo valor al componente padre
        if (onChange) {
            onChange(newValue);
        } 
    };

    //clase de tamaño del contenedor del switch
    const sizes = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
    };

    // clases de tamaño del "knob" (el circulo que se mueve)
    const knobSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    return (

        <button
            onClick={handleToggle}
            disabled={disabled}
            className={`
                relative inline-flex items-center
                rounded-full transition-colors overflow-hidden
                ${sizes[size]}
                ${isActive ? "bg-green-500" : "bg-yellow-500"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className ?? ""}
            `}
        >
            <span
                className={`
                    absolute left-0.5 flex items-center justify-center
                    rounded-full bg-white shadow
                    transition-transform
                    ${knobSizes[size]}
                    ${isActive ? "translate-x-full" : "translate-x-0"}
                `}
            >
                {/* 
                    Icono que cambia dependiendo del estado
                    activo 
                    inactivo
                */}
                {isActive ? (
                    <Check size={12} className="text-green-600"/>
                ) : (
                    <X size={12} className="text-gray-500"/>
                )}
            </span>
        </button>
    )
}