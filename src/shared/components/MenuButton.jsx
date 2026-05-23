import { Link } from "react-router-dom";

// Botón de menú reutilizable.
// Si recibe "to" se comporta como Link, si recibe "onClick" actúa como botón normal.
// Se usa en Home, Config y módulos para las opciones de navegación.

const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.60)",
    border: "1px solid #000000",
    color: "#000000",
    fontWeight: 500,
    fontSize: "0.95rem",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 0.2s",
};

const hoverIn  = (e) => (e.currentTarget.style.background = "rgba(255,255,255,0.80)");
const hoverOut = (e) => (e.currentTarget.style.background = "rgba(255,255,255,0.60)");

export default function MenuButton({ label, icon: Icon, to, onClick }) {
    // Versión Link — para rutas internas
    if (to) return (
        <Link to={to} style={btnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
            <Icon size={20} strokeWidth={1.6} />
            {label}
        </Link>
    );

    // Versión botón — para acciones como "Regresar"
    return (
        <button style={btnStyle} onClick={onClick} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
            <Icon size={20} strokeWidth={1.6} />
            {label}
        </button>
    );
}
