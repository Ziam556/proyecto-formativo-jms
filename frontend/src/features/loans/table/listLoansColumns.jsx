import { Undo2, EllipsisVertical, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  IconButton,
  alertConfirm,
  alertSuccess,
  alertError,
} from "@/shared";
import { cancelLoan } from "../services/loanService";

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

// ── Chip de tipo de préstamo ─────────────────────────────────────────────────
const LOAN_TYPE_STYLES = {
  interno: { background: "#2563eb", color: "#fff" },
  externo: { background: "#d97706", color: "#fff" },
};

function LoanTypeChip({ value }) {
  const s = LOAN_TYPE_STYLES[value] || LOAN_TYPE_STYLES.interno;
  return (
    <span
      className="rounded-full py-[2px] px-[10px] text-[0.75rem] font-semibold whitespace-nowrap inline-block"
      style={{ background: s.background, color: s.color }}
    >
      {value === "externo" ? "Externo" : "Interno"}
    </span>
  );
}

// ── Chip de estado del préstamo ───────────────────────────────────────────────
const STATUS_LABELS = {
  activo:    "Activo",
  devuelto:  "Devuelto",
  cancelado: "Cancelado",
};

const STATUS_STYLES = {
  activo:    { background: "#2563eb", color: "#fff" },
  devuelto:  { background: "#16a34a", color: "#fff" },
  cancelado: { background: "#6b7280", color: "#fff" },
};

function StatusChip({ value }) {
  const s = STATUS_STYLES[value] || { background: "#6b7280", color: "#fff" };
  return (
    <span
      className="rounded-full py-[2px] px-[10px] text-[0.75rem] font-semibold whitespace-nowrap inline-block"
      style={{ background: s.background, color: s.color }}
    >
      {STATUS_LABELS[value] || value || "—"}
    </span>
  );
}

// ── Celda de acciones ────────────────────────────────────────────────────────
function AccionesCell({ row, onRefresh }) {
  const navigate   = useNavigate();
  const yaDevuelto = row.status === "devuelto";
  const cancelado  = row.status === "cancelado";
  const activo     = row.status === "activo";

  const handleCancel = async () => {
    const result = await alertConfirm(
      "¿Cancelar préstamo?",
      `¿Confirmas que deseas cancelar el préstamo #${row.id}? Esta acción no se puede deshacer.`
    );
    if (!result.isConfirmed) return;
    try {
      await cancelLoan(row.id);
      await alertSuccess("Cancelado", `El préstamo #${row.id} fue cancelado correctamente.`);
      if (onRefresh) onRefresh(); else navigate(0);
    } catch (err) {
      await alertError("Error", err.message || "No se pudo cancelar el préstamo.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <IconButton ariaLabel="Más opciones">
            <EllipsisVertical size={16} />
          </IconButton>
        </DropdownTrigger>

        <DropdownContent className="right-0 w-44 bg-[#1e1230]">
          {activo && (
            <DropdownItem onClick={() => navigate("/dashboard/loans/return", { state: { loan: row } })}>
              <span className="inline-flex items-center gap-[5px]">
                <Undo2 size={13} />
                Devolver
              </span>
            </DropdownItem>
          )}

          <DropdownItem onClick={() => navigate("/dashboard/loans/visualize", { state: { loan: row } })}>
            Visualizar
          </DropdownItem>

          {!yaDevuelto && !cancelado && (
            <DropdownItem onClick={() => navigate(`/dashboard/loans/edit?id=${row.id}`, { state: { loan: row } })}>
              Editar
            </DropdownItem>
          )}

          {activo && (
            <DropdownItem onClick={handleCancel} className="text-red-400 hover:text-red-300">
              <span className="inline-flex items-center gap-[5px]">
                <Ban size={13} />
                Cancelar
              </span>
            </DropdownItem>
          )}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}

// ── Definición de columnas ────────────────────────────────────────────────────
const baseLoansColumns = [
  {
    id: "id",
    label: "ID Préstamo",
    accessor: "id",
    width: "13%",
  },
  {
    id: "user",
    label: "Usuario",
    accessor: "user",
    width: "14%",
  },
  {
    id: "materiales",
    label: "Materiales",
    accessor: "materiales",
    width: "24%",
    renderCell: (row) => <MaterialesCell materiales={row.materiales} />,
  },
  {
    id: "departureDate",
    label: "Fecha de salida",
    accessor: "departureDate",
    width: "11%",
  },
  {
    id: "deliveryDate",
    label: "Fecha de entrega",
    accessor: "deliveryDate",
    width: "11%",
  },
  {
    id: "loanType",
    label: "Tipo",
    accessor: "loanType",
    width: "9%",
    renderCell: (row) => <LoanTypeChip value={row.loanType} />,
  },
  {
    id: "status",
    label: "Estado",
    accessor: "status",
    width: "10%",
    renderCell: (row) => <StatusChip value={row.status} />,
  },
];

export const listLoansColumns = [
  ...baseLoansColumns,
  {
    id: "accion",
    label: "Acción",
    accessor: null,
    width: "16%",
    renderCell: (row) => <AccionesCell row={row} />,
  },
];

export function getListLoansColumns(onRefresh) {
  return [
    ...baseLoansColumns,
    {
      id: "accion",
      label: "Acción",
      accessor: null,
      width: "16%",
      renderCell: (row) => <AccionesCell row={row} onRefresh={onRefresh} />,
    },
  ];
}
