import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, FileSpreadsheet } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// InventoryReportDropdown — Submenú 2 niveles
//
// Props:
//   label        → Texto del botón principal
//   inventories  → Array de strings con los nombres de inventario
//   onPDF(name)  → Callback al elegir PDF para un inventario
//   onExcel(name)→ Callback al elegir Excel para un inventario
//   width        → Ancho del botón (default 260px)
// ─────────────────────────────────────────────────────────────────────────────

export default function InventoryReportDropdown({
  label = "Reporte por inventario",
  inventories = [],
  onPDF,
  onExcel,
  width,
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

  const handlePDF = (name) => {
    try { onPDF?.(name); }
    catch (err) { console.error("Error generando PDF:", err); }
    setOpen(false);
  };

  const handleExcel = (name) => {
    try { onExcel?.(name); }
    catch (err) { console.error("Error generando Excel:", err); }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">

      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 text-white border-0 rounded-[8px] text-[0.82rem] font-semibold cursor-pointer box-border p-[10px_16px]"
        style={{
          background: "#00304D",
          width: width ?? "260px",
          height: "48px",
        }}
      >
        <span>{label}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute top-[calc(100%+4px)] left-0 overflow-hidden bg-[rgba(80,50,120,0.97)] rounded-[8px] z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          style={{ minWidth: width ?? "260px" }}
        >
          {inventories.length === 0 ? (
            <div className="px-4 py-3 text-white/50 text-[0.82rem] text-center">
              Sin inventarios registrados
            </div>
          ) : (
            inventories.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between gap-2 px-4 py-[10px] border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
              >
                {/* Nombre del inventario */}
                <span className="text-white text-[0.82rem] font-medium truncate flex-1">
                  {name}
                </span>

                {/* Botones PDF / Excel */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handlePDF(name)}
                    title="Descargar PDF"
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(140,80,180,0.7)] hover:bg-[rgba(160,100,200,0.9)] text-white text-[0.72rem] font-semibold transition-colors border-0 cursor-pointer"
                  >
                    <FileText size={12} />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExcel(name)}
                    title="Descargar Excel"
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(30,120,60,0.75)] hover:bg-[rgba(40,150,75,0.9)] text-white text-[0.72rem] font-semibold transition-colors border-0 cursor-pointer"
                  >
                    <FileSpreadsheet size={12} />
                    Excel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
