import { useState } from "react";
import { BackButton } from "@/shared";
import { ListLoans } from "../data/ListLoans";

const TYPE_STYLES = {
  Devolutivo: { background: "#71277A", color: "#fff" },
  Consumo:    { background: "#00C8DC", color: "#fff" },
};

function Field({ label, value }) {
  return (
    <div className="bg-white/80 rounded-[8px] p-3 flex-1 min-w-[140px]">
      <span className="text-black/50 text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
      <p className="text-black font-medium mt-[2px]">{value ?? "—"}</p>
    </div>
  );
}

function TypeChip({ value }) {
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

export default function ViewLoans({ loan: initialLoan, onCancel }) {

  const [searchId, setSearchId] = useState("");
  const [loan, setLoan]         = useState(initialLoan ?? null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = ListLoans.find(
      (l) => l.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (found) {
      setLoan(found);
      setNotFound(false);
    } else {
      setLoan(null);
      setNotFound(true);
    }
  };

  return (
    <div className="
      w-full max-w-[960px] mx-auto
      rounded-2xl border border-white/10
      bg-white/10 backdrop-blur-md
      shadow-2xl p-6
    ">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/loans" />
        <h1 className="text-white text-2xl font-bold">
          Visualizar Préstamo
        </h1>
      </div>

      {/* BUSCADOR POR ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-white text-sm font-medium">
            ID Préstamo
          </label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ej: PR-2026-00072"
            className="
              h-[44px] w-full sm:w-[260px] rounded-md px-4
              bg-white/70 text-black outline-none
              border border-white/30
            "
          />
        </div>
        <button
          onClick={handleSearch}
          className="
            h-[44px] px-5 rounded-md
            bg-cyan-700 hover:bg-cyan-800
            text-white font-semibold transition
          "
        >
          Buscar
        </button>
      </div>

      {/* NO ENCONTRADO */}
      {notFound && (
        <p className="text-red-400 font-medium mb-4">
          No se encontró ningún préstamo con ese ID.
        </p>
      )}

      {/* DATOS DEL PRÉSTAMO */}
      {loan && (
        <>
          <div className="w-full h-px bg-white/20 mb-5" />

          {/* MATERIALES */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">MATERIALES PRESTADOS</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {loan.materiales?.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
                <TypeChip value={m.type} />
                <span className="text-white font-medium">{m.name}</span>
              </div>
            ))}
          </div>

          {/* DATOS DEL PRÉSTAMO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">DATOS DEL PRÉSTAMO</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Field label="ID Préstamo"   value={loan.id} />
            <Field label="Serial"        value={loan.serial} />
            <Field label="Ficha / Grupo" value={loan.ficha} />
            <Field label="Fecha salida"  value={loan.departureDate} />
            <Field label="Fecha entrega" value={loan.deliveryDate} />
          </div>

          {/* USUARIO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">USUARIO</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            <Field label="Usuario solicitante" value={loan.user} />
          </div>

          {/* BOTÓN EDITAR */}
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
            >
              Editar
            </button>
          </div>
        </>
      )}

      {/* ESTADO INICIAL */}
      {!loan && !notFound && (
        <p className="text-white/50 text-sm mt-2">
          Ingresa un ID y presiona Buscar para ver los datos del préstamo.
        </p>
      )}

    </div>
  );
}
