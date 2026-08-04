import { useNavigate, useLocation } from "react-router-dom";
import EditLoans from "../components/EditLoans";
import { updateLoan } from "../services/loanService";
import { alertSuccess, alertError } from "@/shared";

export default function EditLoansPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const loan      = location.state?.loan ?? null;

  // Mapear el shape del loan (de la lista) al shape que espera EditLoans
  const formData = loan
    ? {
        loansId:         String(loan.id),
        fichaGrupo:      loan.ficha       ?? "",
        loanType:        loan.loanType    ?? "interno",
        cantidadConsumo: loan.amount      ?? "",
        fechaSalida:     loan.departureDateRaw ?? "",
        fechaEntrega:    loan.deliveryDateRaw  ?? "",
        justificacion:   loan.justification   ?? "",
        usuarioSolicita: loan.user            ?? "",
      }
    : {};

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

  return (
    <div className="min-h-full px-6 py-5">
      <EditLoans
        formData={formData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
