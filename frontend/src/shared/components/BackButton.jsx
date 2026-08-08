import { useNavigate } from "react-router-dom";
import { IconButton } from "./IconButton";
import { ArrowLeft } from "lucide-react";

// Flecha de regreso para encabezados de página.
// Usa IconButton internamente, así no hay que repetir estilos.
// Si recibe "to" navega a esa ruta, si no, va a la página anterior con navigate(-1).
//
// Variantes:
//   variant="light"  → ícono blanco, hover: fondo blanco + ícono negro   (por defecto, para fondos oscuros/gradiente)
//   variant="dark"   → ícono negro,  hover: fondo neutral-200 + ícono negro (para fondos claros/blancos)

const VARIANTS = {
    light: "text-white hover:bg-white hover:text-black shrink-0",
    dark:  "text-black hover:bg-neutral-200 hover:text-black shrink-0",
};

export default function BackButton({ to, onClick, variant = "light" }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) return onClick();
        if (to)      return navigate(to);
        navigate(-1);
    };

    return (
        <IconButton
            onClick={handleClick}
            ariaLabel="Regresar"
            variant="icon"
            hitSize={48}
            iconSize={22}
            className={VARIANTS[variant] ?? VARIANTS.light}
        >
            <ArrowLeft size={22} />
        </IconButton>
    );
}
