import { useLocation } from "react-router-dom";
import ReturnLoans from "../components/ReturnLoans";

export default function ReturnLoansPage() {
  const location = useLocation();
  const loan = location.state?.loan ?? null;

  return (
    <div className="min-h-full px-6 py-5">
      <ReturnLoans loan={loan} />
    </div>
  );
}
