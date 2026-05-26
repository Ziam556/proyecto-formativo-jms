// Muestra una fila de pastillas con conteos por estado.
// Cada pill tiene un punto de color, el número y la etiqueta.
// Recibe: stats = [{ label, count, color }]
export default function StatsPills({ stats = [] }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {stats.map(({ label, count, color }) => (
                <span
                    key={label}
                    className="flex items-center gap-[6px] bg-[rgba(30,20,60,0.7)] text-[#e2e8f0] rounded-full py-[5px] px-[14px] text-[0.82rem] font-semibold"
                >
                    {/* Punto de color que identifica el estado — el color viene del dato, se mantiene inline */}
                    <span
                        className="w-2 h-2 rounded-full inline-block shrink-0"
                        style={{ background: color }}
                    />
                    {count} {label}
                </span>
            ))}
        </div>
    );
}
