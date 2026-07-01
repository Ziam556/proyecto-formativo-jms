import { useState } from "react";
import { BackButton, Button, Field, Input, alertWarning, alertError } from "@/shared";
import { getLoanById } from "../services/loanService";

const TYPE_STYLES = {
  Devolutivo: { background: "#71277A", color: "#fff" },
  Consumo:    { background: "#00C8DC", color: "#fff" },
};

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

  const [searchId, setSearchId] = useState(
    initialLoan ? String(initialLoan.id) : ""
  );
  const [loan, setLoan]         = useState(initialLoan ?? null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSearch = async () => {
    const id = searchId.trim();
    if (!id) {
      await alertWarning("Campo requerido", "Ingresa un ID de préstamo para buscar.");
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const found = await getLoanById(id);
      setLoan(found);
    } catch {
      setLoan(null);
      setNotFound(true);
      await alertError("No encontrado", `No se encontró ningún préstamo con ID "${id}".`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[960px] mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton to="/dashboard/loans" />
        <h1 className="text-white text-2xl font-bold">Visualizar Préstamo</h1>
      </div>

      {/* BUSCADOR POR ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="w-full sm:w-[260px]">
          <Input
            label="ID Préstamo"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ej: 72"
          />
        </div>
        <Button
          variant="secondary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Buscando…" : "Buscar"}
        </Button>
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
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2"
              >
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
            <Field label="Ficha / Grupo" value={loan.ficha} />
            <Field label="Fecha salida"  value={loan.departureDate} />
            <Field label="Fecha entrega" value={loan.deliveryDate} />
            <Field label="Estado"        value={loan.status} />
          </div>

          {/* USUARIO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white font-semibold">USUARIO</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="w-full sm:w-[280px]">
              <Field label="Usuario solicitante" value={loan.user} />
            </div>
          </div>

          {/* BOTÓN EDITAR */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onCancel}>
              Editar
            </Button>
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
