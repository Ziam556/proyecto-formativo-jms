import { useLocation, useNavigate } from "react-router-dom";
import ViewConsumableMaterial from "../components/ViewConsumableMaterial";

export default function ViewConsumableMaterialPage() {

  const location = useLocation();
  const navigate  = useNavigate();
  const material  = location.state?.material ?? null;

  return (

    <div className="min-h-[calc(100vh-64px)] px-6 py-5">

      <ViewConsumableMaterial
        material={material}
        onCancel={() => navigate("/dashboard/consumable-material/edit", { state: { material } })}
      />

    </div>

  );
}