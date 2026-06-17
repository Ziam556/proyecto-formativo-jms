import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// COMPONENTE GENERAL PARA REPORTES
//
// Props:
// label      → Texto del botón
// color      → Color fondo botón
// width      → Ancho personalizado
// height     → Alto personalizado
// onPDF      → Función para generar PDF
// onExcel    → Función para generar Excel
//
// Este componente sirve para:
// - Usuarios
// - Material consumo
// - Material devolutivo
// - Equipos
// - Inventarios
// - Cualquier reporte
// ─────────────────────────────────────────────────────────────

export default function ReportDropdown({
  label = "Generar reporte",
  color = "#700D7C",
  width,
  height,
  onPDF,
  onExcel,
}) {

  // Estado dropdown
  const [open, setOpen] = useState(false);

  // Ref contenedor
  const ref = useRef(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);

  }, []);

  // ─────────────────────────────────────────
  // GENERAR PDF
  // ─────────────────────────────────────────
  const handlePDF = () => {
    try {
      if (onPDF) {
        onPDF();
        console.log("Reporte PDF descargado correctamente");
      } else {
        console.warn("No se asignó función PDF");
      }
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF");
    }
    setOpen(false);
  };

  // ─────────────────────────────────────────
  // GENERAR EXCEL
  // ─────────────────────────────────────────
  const handleExcel = () => {
    try {
      if (onExcel) {
        onExcel();
        console.log("Reporte Excel descargado correctamente");
      } else {
        console.warn("No se asignó función Excel");
      }
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error al generar el Excel");
    }
    setOpen(false);
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (

    <div ref={ref} className="relative">

      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex  items-center justify-between gap-2 text-white border-0 rounded-[8px] text-[0.82rem] font-semibold cursor-pointer box-border p-[10px_16px]"
        style={{
          background: "#00304D",
          width: width ?? "220px",
          height: height ?? "48px",
        }}
      >
        <span>{label}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 overflow-hidden bg-[rgba(80,50,120,0.95)] rounded-[8px] z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">

          {/* PDF */}
          <button
            onClick={handlePDF}
            className="w-full py-3 px-4 bg-[rgba(140,80,180,0.7)] border-0 text-white text-[0.88rem] font-semibold cursor-pointer text-center hover:bg-[rgba(160,100,200,0.9)] transition-colors duration-200"
          >
            Descargar PDF
          </button>

          {/* EXCEL */}
          <button
            onClick={handleExcel}
            className="w-full py-3 px-4 bg-[rgba(140,80,180,0.7)] border-0 text-white text-[0.88rem] font-semibold cursor-pointer text-center hover:bg-[rgba(160,100,200,0.9)] transition-colors duration-200"
          >
            Descargar Excel
          </button>

        </div>
      )}

    </div>
  );
}