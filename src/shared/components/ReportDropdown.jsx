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
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: color,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: width ?? "auto",
                    height: height ?? "auto",
                    minWidth: width ? undefined : "200px",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                }}
            >
                <span>{label}</span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "rgba(80,50,120,0.95)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    zIndex: 200,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}>
                    {[
                        { label: "PDF",   handler: handlePDF },
                        { label: "Excel", handler: handleExcel },
                    ].map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.handler}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(140,80,180,0.7)",
                                border: "none",
                                color: "#fff",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(160,100,200,0.9)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(140,80,180,0.7)"}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
