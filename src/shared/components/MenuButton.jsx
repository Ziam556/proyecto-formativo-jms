import { Link } from "react-router-dom";

// Botón de menú reutilizable.
// Si recibe "to" se comporta como Link, si recibe "onClick" actúa como botón normal.
// Se usa en Home, Config y módulos para las opciones de navegación.

// Clases compartidas: fondo semitransparente, borde, texto, hover con Tailwind
const btnClass = "flex items-center gap-3 py-[14px] px-5 rounded-lg bg-[rgba(255,255,255,0.60)] border border-black text-black font-medium text-[0.95rem] no-underline cursor-pointer transition-colors duration-200 hover:bg-[rgba(255,255,255,0.80)]";

export default function MenuButton({ label, icon: Icon, to, onClick }) {
    // Versión Link — para rutas internas
    if (to) return (
        <Link to={to} className={btnClass}>
            <Icon size={20} strokeWidth={1.6} />
            {label}
        </Link>
    );

    // Versión botón — para acciones como "Regresar"
    return (
        <button className={btnClass} onClick={onClick}>
            <Icon size={20} strokeWidth={1.6} />
            {label}
        </button>
    );
}
