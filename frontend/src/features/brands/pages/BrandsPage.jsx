import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MenuButton } from "@/shared";

export default function BrandsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-module-card rounded-[20px] overflow-hidden backdrop-blur-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-[680px] w-full px-6 sm:px-10 py-8 sm:py-12">
                <h2 className="text-white text-center text-[1.1rem] sm:text-[1.3rem] font-bold mb-6 sm:mb-8">
                    Módulo de marcas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MenuButton label="Regresar" icon={ArrowLeft} onClick={() => navigate("/dashboard/home")} />
                </div>
            </div>
        </div>
    );
}
