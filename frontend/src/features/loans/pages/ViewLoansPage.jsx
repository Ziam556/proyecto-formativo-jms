import { useLocation, useNavigate } from "react-router-dom";
import ViewLoans from "../components/ViewLoans";

export default function ViewLoansPage() {

  const location = useLocation();
  const navigate  = useNavigate();
  const loan      = location.state?.loan ?? null;

  return (
    <div className="min-h-full px-6 py-3">
      <ViewLoans
        loan={loan}
        onCancel={() => navigate("/dashboard/loans")}
        onEdit={(loanData) => navigate("/dashboard/loans/edit", { state: { loan: loanData } })}
      />
    </div>
  );
}
