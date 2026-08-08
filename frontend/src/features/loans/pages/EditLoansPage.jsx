import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import EditLoans from "../components/EditLoans";
import { updateLoan, getLoanById } from "../services/loanService";
import { alertSuccess, alertError, alertWarning, Input, Button, BackButton } from "@/shared";

export default function EditLoansPage() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();
  const loanState      = location.state?.loan ?? null;

  // Loan ID: prefer navigation state, fall back to URL query param
  const initialId = loanState?.id ? String(loanState.id) : (searchParams.get("id") ?? "");

  // ── Búsqueda por ID (cuando no viene de la lista) ─────────────────────────
  const [searchId, setSearchId] = useState(initialId);
  const [loanId,   setLoanId]   = useState(initialId || null);

  // Pre-populate from navigation state so materials show instantly
  const buildFormData = (src) => ({
    loansId:         src?.id            ? String(src.id)      : "",
    fichaGrupo:      src?.ficha         ?? "",
    loanType:        src?.loanType      ?? "interno",
    cantidadConsumo: src?.amount        ?? "",
    fechaSalida:     src?.departureDateRaw ?? "",
    fechaEntrega:    src?.deliveryDateRaw  ?? "",
    justificacion:   src?.justification ?? "",
    usuarioSolicita: src?.user          ?? "",
    materiales:      src?.materiales    ?? [],
  });

  const [formData, setFormData] = useState(() => buildFormData(loanState));
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!loanId) return;
    setLoading(true);
    getLoanById(loanId)
      .then((loan) => {
        if (loan.status === "devuelto" || loan.status === "cancelado") {
          alertError(
            "Préstamo no editable",
            `El préstamo #${loan.id} ya fue ${{ devuelto: "devuelto", cancelado: "cancelado" }[loan.status] ?? loan.status} y no puede editarse.`
          );
          setLoanId(null);
          return;
        }
        setFormData({
          loansId:         String(loan.id),
          fichaGrupo:      loan.ficha            ?? "",
          loanType:        loan.loanType         ?? "interno",
          cantidadConsumo: loan.amount           ?? "",
          fechaSalida:     loan.departureDateRaw ?? "",
          fechaEntrega:    loan.deliveryDateRaw  ?? "",
          justificacion:   loan.justification    ?? "",
          usuarioSolicita: loan.user             ?? "",
          materiales:      loan.materiales?.length
            ? loan.materiales
            : (loanState?.materiales ?? []),
        });
      })
      .catch(() => {
        alertError("No encontrado", `No se encontró ningún préstamo con ID "${loanId}".`);
        setLoanId(null);
      })
      .finally(() => setLoading(false));
  }, [loanId]);

  const handleSearch = async () => {
    const id = searchId.trim();
    if (!id) {
      await alertWarning("Campo requerido", "Ingresa un ID de préstamo.");
      return;
    }
    setLoanId(id);
  };

  const handleSave = async (data) => {
    const { loansId, fichaGrupo, loanType, cantidadConsumo, fechaSalida, fechaEntrega, justificacion, usuarioSolicita } = data;
    try {
      await updateLoan(loansId, {
        fileGroup:      fichaGrupo      || null,
        loanType:       loanType        || "interno",
        amount:         cantidadConsumo ? parseInt(cantidadConsumo) : null,
        departureDate:  fechaSalida
          ? new Date(fechaSalida).toISOString().split("T")[0]
          : null,
        deliveryDate:   fechaEntrega
          ? new Date(fechaEntrega).toISOString().split("T")[0]
          : null,
        justification:  justificacion   || null,
        requestingUser: usuarioSolicita || null,
      });
      await alertSuccess("¡Préstamo actualizado!", "Los cambios se guardaron correctamente.");
      navigate("/dashboard/loans");
    } catch (err) {
      await alertError("Error al actualizar", err.message || "Ocurrió un error inesperado.");
    }
  };

  const handleCancel = () => navigate("/dashboard/loans");

  // ── Sin loan seleccionado → mostrar buscador ───────────────────────────────
  if (!loanId) {
    return (
      <div className="min-h-full px-6 py-5 flex items-center justify-center">
        <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BackButton to="/dashboard/loans" />
            <h1 className="text-white text-xl font-bold">Editar préstamo</h1>
          </div>
          <p className="text-white/60 text-sm mb-5">
            Ingresa el ID del préstamo que deseas editar.
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="ID Préstamo"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ej: 5"
              />
            </div>
            <Button variant="primary" size="md" onClick={handleSearch} disabled={loading}>
              {loading ? "Buscando…" : "Buscar"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-5">
      <EditLoans
        formData={formData}
        loading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
