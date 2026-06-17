import { useState } from "react";
import { BackButton, Button } from "@/shared";
import { ListLoans } from "../data/ListLoans";

const TAG_STYLES = {
  Devolutivo: { bg: "rgba(139,0,139,0.3)", color: "#e9b8ff", border: "rgba(200,100,255,0.25)" },
  Consumo:    { bg: "rgba(6,182,212,0.18)", color: "#a5f3fc", border: "rgba(6,182,212,0.25)" },
};

function TypeTag({ type }) {
  const s = TAG_STYLES[type] || TAG_STYLES.Devolutivo;
  return (
    <span style={{ background: s.bg, color: s.color, border: `0.5px solid ${s.border}` }}
      className="text-[9px] font-medium px-2 py-[2px] rounded-full whitespace-nowrap flex-shrink-0">
      {type}
    </span>
  );
}

function StatePill({ label, active, color, onClick }) {
  const colors = {
    good:  { active: "rgba(16,185,129,0.22)", border: "rgba(16,185,129,0.45)", text: "#6ee7b7" },
    bad:   { active: "rgba(245,158,11,0.22)",  border: "rgba(245,158,11,0.45)",  text: "#fde68a" },
    loss:  { active: "rgba(239,68,68,0.22)",   border: "rgba(239,68,68,0.45)",   text: "#fca5a5" },
  };
  const c = colors[color];
  return (
    <button
      onClick={onClick}
      style={active ? { background: c.active, borderColor: c.border, color: c.text } : {}}
      className={`text-[10px] px-[10px] py-[3px] rounded-full border transition-all cursor-pointer
        ${active ? "" : "border-white/18 bg-white/5 text-white"}`}
    >
      {label}
    </button>
  );
}

export default function ReturnLoans({ loan: initialLoan }) {
  const [searchId, setSearchId]   = useState(initialLoan?.id ?? "");
  const [loan, setLoan]           = useState(initialLoan ?? null);
  const [notFound, setNotFound]   = useState(false);
  const [toReturn, setToReturn]   = useState([]);
  const [success, setSuccess]     = useState(false);

  const handleSearch = () => {
    const found = ListLoans.find(l => l.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) { setLoan(found); setNotFound(false); setToReturn([]); setSuccess(false); }
    else { setLoan(null); setNotFound(true); }
  };

  const addItem = (mat) => {
    if (toReturn.find(i => i.name === mat.name)) return;
    const base = { ...mat, observations: "" };
    if (mat.type === "Devolutivo") {
      setToReturn(p => [...p, { ...base, state: null, returned: false }]);
    } else {
      setToReturn(p => [...p, { ...base, lent: mat.amount ?? 1, leftover: 0 }]);
    }
  };

  const removeItem = (name) => setToReturn(p => p.filter(i => i.name !== name));

  const updateItem = (name, changes) =>
    setToReturn(p => p.map(i => i.name === name ? { ...i, ...changes } : i));

  const isAdded = (name) => toReturn.some(i => i.name === name);

  const handleConfirm = () => {
    if (toReturn.length === 0) return;
    console.log("Devolución registrada:", { loanId: loan.id, items: toReturn });
    setSuccess(true);
    setToReturn([]);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-4">
      <div className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl px-4 py-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <BackButton to="/dashboard/loans" />
        <h1 className="text-white text-xl font-bold">Registrar Devolución</h1>
      </div>

      {/* BUSCADOR */}
      <div className="flex gap-3 mb-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-white text-sm font-medium">ID Préstamo</label>
        <input
          type="text"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Buscar préstamo por ID...  Ej: PR-2026-00072"
          className="w-full h-[40px] rounded-lg px-4 bg-white/10 border border-white/22 text-white placeholder-white/30 text-sm outline-none"
        />
        </div>
        <button
          onClick={handleSearch}
          className="h-[40px] px-5 rounded-md bg-cyan-700 hover:bg-cyan-800 text-white font-semibold transition self-end"
        >
          Buscar
        </button>
      </div>

      {notFound && <p className="text-red-400 text-sm mb-4">No se encontró ningún préstamo con ese ID.</p>}

      {success && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-3 text-green-300 text-sm mb-4">
          ✓ Devolución registrada exitosamente.
        </div>
      )}

      {/* CHIPS INFO */}
      {loan && (
        <>
          <div className="flex gap-3 flex-wrap items-center px-4 py-3 bg-white/6 rounded-xl mb-5">
            {[
              { lbl: "ID",       val: loan.id },
              { lbl: "Usuario",  val: loan.user },
              { lbl: "Ficha",    val: loan.ficha },
              { lbl: "Salida",   val: loan.departureDate },
              { lbl: "Límite",   val: loan.deliveryDate, red: true },
            ].map((c, i) => (
              <div key={i} className="flex flex-col gap-[1px]">
                <span className="text-white text-[9px] uppercase tracking-wider">{c.lbl}</span>
                <span className={`text-[12px] font-medium ${c.red ? "text-red-300" : "text-white"}`}>{c.val}</span>
              </div>
            ))}
          </div>

          {/* DOS COLUMNAS */}
          <div className="grid grid-cols-2 gap-3">

            {/* IZQUIERDA — materiales del préstamo */}
            <div className="bg-white/6 border border-white/12 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-[10px] uppercase tracking-widest">Materiales prestados</span>
                <span className="bg-white/12 text-white text-[10px] px-2 py-[1px] rounded-full">{loan.materiales.length}</span>
              </div>

              {loan.materiales.map((mat, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-lg mb-1 hover:bg-white/8 transition">
                  <TypeTag type={mat.type} />
                  <span className={`text-[12px] flex-1 ${isAdded(mat.name) ? "text-white/35 line-through" : "text-white"}`}>
                    {mat.name}
                  </span>
                  {isAdded(mat.name)
                    ? <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center bg-green-500/15 border border-green-400/30 text-green-400 text-[12px]">✓</span>
                    : <button onClick={() => addItem(mat)}
                        className="w-[22px] h-[22px] rounded-md flex items-center justify-center bg-purple-500/25 border border-purple-400/40 text-purple-300 text-[15px] hover:bg-purple-500/40 transition">
                        +
                      </button>
                  }
                </div>
              ))}

              <p className="text-white text-[10px] text-center mt-3">Toca + para agregar a la devolución →</p>
            </div>

            {/* DERECHA — a devolver */}
            <div className="bg-white/6 border border-white/12 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-[10px] uppercase tracking-widest">A devolver</span>
                <span className="bg-white/12 text-white text-[10px] px-2 py-[1px] rounded-full">{toReturn.length}</span>
              </div>

              {toReturn.length === 0 && (
                <p className="text-white text-[11px] text-center py-8">Selecciona materiales del panel izquierdo</p>
              )}

              {toReturn.map((item, i) => (
                <div key={i} className="bg-white/6 border border-white/12 rounded-xl p-[10px] mb-2">

                  {/* fila superior */}
                  <div className="flex items-center gap-2 mb-2">
                    <TypeTag type={item.type} />
                    <span className="text-white text-[12px] font-medium flex-1">{item.name}</span>
                    <button onClick={() => removeItem(item.name)}
                      className="w-[22px] h-[22px] rounded-md flex items-center justify-center bg-red-500/15 border border-red-400/30 text-red-300 text-[14px] hover:bg-red-500/30 transition">
                      ×
                    </button>
                  </div>

                  {/* DEVOLUTIVO */}
                  {item.type === "Devolutivo" && (
                    <>
                      <div className="flex gap-1 mb-2">
                        <StatePill label="✓ Bueno"  color="good" active={item.state === "Bueno"}  onClick={() => updateItem(item.name, { state: "Bueno" })}  />
                        <StatePill label="Dañado"   color="bad"  active={item.state === "Dañado"} onClick={() => updateItem(item.name, { state: "Dañado" })} />
                        <StatePill label="Pérdida"  color="loss" active={item.state === "Pérdida"} onClick={() => updateItem(item.name, { state: "Pérdida" })} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          onClick={() => updateItem(item.name, { returned: !item.returned })}
                          className={`w-[17px] h-[17px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition flex-shrink-0
                            ${item.returned ? "bg-green-500/25 border-green-400 text-green-300 text-[10px]" : "bg-white/4 border-white/20"}`}>
                          {item.returned && "✓"}
                        </div>
                        <span className="text-white text-[11px]">Marcar como devuelto</span>
                      </div>
                    </>
                  )}

                  {/* CONSUMO */}
                  {item.type === "Consumo" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white text-[10px]">Prestado: <b className="text-white/75">{item.lent}</b></span>
                      <div className="flex-1" />
                      <span className="text-white text-[10px]">Sobrante:</span>
                      <div className="flex items-center bg-white/7 border border-white/15 rounded-lg overflow-hidden">
                        <button onClick={() => updateItem(item.name, { leftover: Math.max(0, item.leftover - 1) })}
                          className="w-[24px] h-[26px] flex items-center justify-center text-white text-[14px] hover:bg-white/10 transition">−</button>
                        <span className="text-white text-[12px] font-medium min-w-[24px] text-center border-x border-white/10 leading-[26px]">{item.leftover}</span>
                        <button onClick={() => updateItem(item.name, { leftover: Math.min(item.lent, item.leftover + 1) })}
                          className="w-[24px] h-[26px] flex items-center justify-center text-white text-[14px] hover:bg-white/10 transition">+</button>
                      </div>
                    </div>
                  )}

                  {/* OBSERVACIONES */}
                  <div>
                    <span className="text-white text-[9px] uppercase tracking-wider">Observaciones</span>
                    <input
                      type="text"
                      value={item.observations}
                      onChange={e => updateItem(item.name, { observations: e.target.value })}
                      placeholder="Sin novedad..."
                      className="w-full mt-[3px] bg-white/7 border border-white/12 rounded-lg px-3 py-[5px] text-white text-[11px] outline-none placeholder-white/22"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACCIONES */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setToReturn([]); setSuccess(false); }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={toReturn.length === 0}
            >
              Confirmar Devolución
            </Button>
          </div>
        </>
      )}

      {!loan && !notFound && (
        <p className="text-white text-sm mt-2">Ingresa un ID y presiona Buscar para ver el préstamo.</p>
      )}
      </div>
    </div>
  );
}
