import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserRegisterForm from "../components/UserRegisterForm";

export default function CreateUserPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border py-6 px-4 sm:px-10 gap-3 items-center justify-center">

            {/* Título */}
            <h1 className="text-white text-[1.1rem] sm:text-[1.2rem] font-semibold m-0">
                Registro de usuario
            </h1>

            {/* Contenedor exterior glass */}
            <div className="w-full max-w-[1100px] mx-auto rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-[16px] border border-white/20 relative pt-12 px-4 sm:px-10 pb-10">

                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/userpage")}
                    className="absolute top-4 left-4 bg-transparent border-0 cursor-pointer text-white z-[1]"
                    title="Regresar"
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Contenedor interior glass blanco */}
                <div className="w-full rounded-xl bg-[rgba(255,255,255,0.31)] py-6 sm:py-9 px-4 sm:px-10">
                    <UserRegisterForm onCancel={() => navigate("/dashboard/userpage")} />
                </div>
            </div>
        </div>
    );
}
