// Anillo SVG de progreso circular — compartido entre los 3 pasos de recuperación
export default function StepRing({ step, total = 3, children }) {
    const R            = 44;
    const cx           = 52;
    const cy           = 52;
    const circumference = 2 * Math.PI * R;
    const dashOffset   = circumference * (1 - step / total);

    return (
        <div className="relative flex items-center justify-center" style={{ width: 104, height: 104 }}>
            <svg
                width="104" height="104"
                viewBox="0 0 104 104"
                className="absolute inset-0"
                style={{ transform: "rotate(-90deg)" }}
            >
                {/* Track */}
                <circle
                    cx={cx} cy={cy} r={R}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="5"
                />
                {/* Progreso */}
                <circle
                    cx={cx} cy={cy} r={R}
                    fill="none"
                    stroke="#50E5F9"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
            </svg>
            {/* Icono central */}
            <div className="w-[68px] h-[68px] rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center z-10">
                {children}
            </div>
        </div>
    );
}
