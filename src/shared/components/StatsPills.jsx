// Muestra una fila de pastillas con conteos por estado.
// Cada pill tiene un punto de color, el número y la etiqueta.
// Recibe: stats = [{ label, count, color }]
export default function StatsPills({ stats = [] }) {
    return (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {stats.map(({ label, count, color }) => (
                <span
                    key={label}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(30,20,60,0.7)", // fondo oscuro semitransparente
                        color: "#e2e8f0",
                        borderRadius: "999px",            // forma de cápsula
                        padding: "5px 14px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                    }}
                >
                    {/* Punto de color que identifica el estado */}
                    <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        display: "inline-block",
                        flexShrink: 0,
                    }} />
                    {count} {label}
                </span>
            ))}
        </div>
    );
}
