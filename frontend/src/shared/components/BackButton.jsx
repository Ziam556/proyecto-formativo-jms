import { useNavigate } from "react-router-dom";
import { IconButton } from "./IconButton";
import { ArrowLeft } from "lucide-react";

// Flecha de regreso para encabezados de página.
// Usa IconButton internamente, así no hay que repetir estilos.
// Si recibe "to" navega a esa ruta, si no, va a la página anterior con navigate(-1).

// dark=true → flecha negra (para fondos claros como UserProfilePage)
export default function BackButton({ to, onClick, dark = false }) {
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
            className={
                dark
                    ? "text-black hover:bg-neutral-200 hover:text-black shrink-0"
                    : "text-white hover:bg-white hover:text-black shrink-0"
            }
        >
            <ArrowLeft size={22} />
        </IconButton>
    );
}
