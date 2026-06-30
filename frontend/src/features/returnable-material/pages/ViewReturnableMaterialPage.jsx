import { useLocation, useNavigate } from "react-router-dom";
import ViewReturnableMaterial from "../components/ViewReturnableMaterial";

export default function ViewReturnableMaterialPage() {

  const location  = useLocation();
  const navigate  = useNavigate();
  const material  = location.state?.material ?? null;

  return (
    <div className="min-h-full px-6 py-5">
      <ViewReturnableMaterial
        material={material}
        onEdit={() => navigate("/dashboard/returnable-material/edit", { state: { material } })}
      />
    </div>
  );
}
