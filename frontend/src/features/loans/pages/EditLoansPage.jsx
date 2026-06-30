import EditLoans from "../components/EditLoans";
import { useNavigate } from "react-router-dom";

export default function EditLoansPage() {
  const navigate = useNavigate();

  const handleSave = (data) => {
    console.log("Préstamo guardado:", data);
    navigate("/dashboard/loans");
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