import { useNavigate } from "react-router-dom";
import EditLoans from "../components/EditLoans";
import { updateLoan } from "../services/loanService";
import { alertSuccess, alertError } from "@/shared";

export default function EditLoansPage() {
  const navigate = useNavigate();

  const handleSave = async (data) => {
    const { loansId, fichaGrupo, cantidadConsumo, fechaSalida, fechaEntrega, justificacion, usuarioSolicita } = data;

    try {
      await updateLoan(loansId, {
        fileGroup:       fichaGrupo      || null,
        amount:          cantidadConsumo ? parseInt(cantidadConsumo) : null,
        departureDate:   fechaSalida
          ? new Date(fechaSalida).toISOString().split("T")[0]
          : null,
        deliveryDate:    fechaEntrega
          ? new Date(fechaEntrega).toISOString().split("T")[0]
          : null,
        justification:   justificacion   || null,
        requestingUser:  usuarioSolicita || null,
      });

      await alertSuccess("¡Préstamo actualizado!", "Los cambios se guardaron correctamente.");
      navigate("/dashboard/loans");
    } catch (err) {
      await alertError("Error al actualizar", err.message || "Ocurrió un error inesperado.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/loans");
  };

  return (
    <div className="min-h-full px-6 py-5">
      <EditLoans
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
