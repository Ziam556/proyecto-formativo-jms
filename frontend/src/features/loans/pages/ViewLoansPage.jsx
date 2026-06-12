import { useLocation, useNavigate } from "react-router-dom";
import ViewLoans from "../components/ViewLoans";

export default function ViewLoansPage() {

  const location = useLocation();
  const navigate  = useNavigate();
  const loan      = location.state?.loan ?? null;

  return (

    <div className="min-h-[calc(100vh-64px)] px-6 py-5">

      <ViewLoans
        loan={loan}
        onCancel={() => navigate("/dashboard/loans/edit", { state: { loan } })}
      />

    </div>

  );
}