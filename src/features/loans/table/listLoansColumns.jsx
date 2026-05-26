import { Undo2 } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@/shared";

// ── Chip de tipo de material ─────────────────────────────────────────────────
const TYPE_STYLES = {
  Devolutivo: { background: "#71277A", color: "#fff" },
  Consumo:    { background: "#00C8DC", color: "#fff" },
};

function TypeChip({ value }) {
  // background y color vienen del dato — se mantienen inline
  const s = TYPE_STYLES[value] || { background: "#6b7280", color: "#fff" };
  return (
    <span
      className="rounded-full py-[2px] px-[10px] text-[0.75rem] font-semibold whitespace-nowrap inline-block"
      style={{ background: s.background, color: s.color }}
    >
      {value}
    </span>
  );
}

// ── Celda de materiales (con popover "Ver más" si hay más de 2) ──────────────
const MAX_VISIBLE = 2;

function MaterialesCell({ materiales = [] }) {
  const visible = materiales.slice(0, MAX_VISIBLE);
  const extra   = materiales.slice(MAX_VISIBLE);
  const hasMore = extra.length > 0;

  return (
    <div className="flex flex-col gap-1">

      {/* Primeros 2 materiales */}
      {visible.map((m, i) => (
        <div key={i} className="flex items-center gap-[6px]">
          <TypeChip value={m.type} />
          <span className="text-[0.82rem]">{m.name}</span>
        </div>
      ))}

      {/* Botón "Ver más" con dropdown flotante */}
      {hasMore && (
        <Dropdown>
          <DropdownTrigger>
            <button className="bg-transparent border border-[#9C68A2] rounded-full cursor-pointer text-[#7D3A86] text-[0.72rem] font-semibold py-[1px] px-2 self-start hover:bg-[#7D3A86] hover:text-white transition-colors duration-150">
              Ver más ▾
            </button>
          </DropdownTrigger>

          <DropdownContent className="left-0">
            <div className="flex flex-col gap-[6px] py-[6px] px-1 min-w-[210px] bg-[#1e1230] rounded-xl">
              {extra.map((m, i) => (
                <div key={i} className="flex items-center gap-2 py-[3px] px-[6px]">
                  <TypeChip value={m.type} />
                  <span className="text-[0.82rem] text-[#e2e8f0]">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </DropdownContent>
        </Dropdown>
      )}

    </div>
  );
}

// ── Botón Devolver ────────────────────────────────────────────────────────────
function DevolverButton({ row }) {
  const handleDevolver = () => {
    console.log("Devolver préstamo:", row.id);
  };

  return (
    <button
      onClick={handleDevolver}
      className="inline-flex items-center gap-[5px] py-[5px] px-3 border-[1.5px] border-[#71277A] rounded-[6px] bg-white text-[#71277A] text-[0.8rem] font-semibold cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-[#71277A] hover:text-white"
    >
      <Undo2 size={14} />
      Devolver
    </button>
  );
}

// ── Definición de columnas ────────────────────────────────────────────────────
export const listLoansColumns = [
  {
    id: "id",
    label: "ID Préstamo",
    accessor: "id",
    width: "16%",
  },
  {
    id: "user",
    label: "Usuario",
    accessor: "user",
    width: "16%",
  },
  {
    id: "materiales",
    label: "Materiales",
    accessor: "materiales",
    width: "28%",
    renderCell: (row) => <MaterialesCell materiales={row.materiales} />,
  },
  {
    id: "departureDate",
    label: "Fecha Salida",
    accessor: "departureDate",
    width: "13%",
  },
  {
    id: "deliveryDate",
    label: "Fecha Entrega",
    accessor: "deliveryDate",
    width: "13%",
  },
  {
    id: "accion",
    label: "Acción",
    accessor: null,
    width: "14%",
    renderCell: (row) => <DevolverButton row={row} />,
  },
];
