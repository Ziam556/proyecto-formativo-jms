import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Botón de reporte con opciones PDF y Excel.
// Props:
//   label   — texto del botón
//   color   — color de fondo del botón (default púrpura)
//   onPDF   — callback al elegir PDF   (opcional, por defecto muestra alert)
//   onExcel — callback al elegir Excel (opcional, por defecto muestra alert)

export default function ReportDropdown({
    label,
    color = "#700D7C",
    width,
    height,
    onPDF,
    onExcel,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handlePDF = () => {
        onPDF ? onPDF() : alert("Generando PDF...");
        setOpen(false);
    };

    const handleExcel = () => {
        onExcel ? onExcel() : alert("Generando Excel...");
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* color, width y height vienen como props — se mantienen inline */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-between gap-2 text-white border-0 rounded-lg px-4 text-[0.82rem] font-semibold cursor-pointer box-border"
                style={{
                    background: color,
                    width: width ?? "auto",
                    height: height ?? "auto",
                    minWidth: width ? undefined : "200px",
                    padding: "10px 16px",
                }}
            >
                <span>{label}</span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[rgba(80,50,120,0.95)] rounded-lg overflow-hidden z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                    {[
                        { label: "PDF",   handler: handlePDF },
                        { label: "Excel", handler: handleExcel },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.handler}
                            className="block w-full py-3 px-4 bg-[rgba(140,80,180,0.7)] border-0 text-white text-[0.88rem] font-semibold cursor-pointer text-center hover:bg-[rgba(160,100,200,0.9)] transition-colors duration-150"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
