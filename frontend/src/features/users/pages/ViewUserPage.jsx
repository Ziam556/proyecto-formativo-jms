import { useParams, useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { Button, Field } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";

const API_BASE = "http://localhost:4000";

function ProfileAvatar({ src, size = 72 }) {
    const iconSize = Math.round(size * 0.46);
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[rgba(255,255,255,0.4)] border-2 border-white overflow-hidden flex items-center justify-center flex-shrink-0"
        >
            {src ? (
                <img src={src} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
                <User size={iconSize} className="text-[#6b6b9a]" />
            )}
        </div>
    );
}

// ─── Cabecera de sección numerada ─────────────────────────────────────────────
function SectionHeader({ number, title, color = "#7c3aed" }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold flex-shrink-0"
                style={{ backgroundColor: color }}
            >
                {number}
            </div>
            <span className="text-[0.75rem] font-semibold tracking-widest text-[#ffffff] uppercase">
                {title}
            </span>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ViewUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const user = state?.user ?? null;

    if (!user) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <p className="text-white text-lg">Usuario no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col items-center px-6 py-6 gap-4">

            {/* Título */}
            <h1 className="text-white text-[1.1rem] font-semibold tracking-wide">
                Visualizar usuario
            </h1>

            {/* Tarjeta principal */}
            <div className="w-full max-w-[1400px] bg-[rgba(200,195,240,0.45)] backdrop-blur-[16px] rounded-2xl border border-[rgba(255,255,255,0.3)] p-6 flex flex-col gap-5">

                {/* Perfil */}
                <div className="flex items-center gap-4">
                    <ProfileAvatar src={user.image ? `${API_BASE}/${user.image}` : null} />
                    <div className="flex flex-col gap-1">
                        <span className="text-[#1a1a3e] font-extrabold text-[1rem]">@{user.name}</span>
                        <span className="text-[#2a2a50] text-[0.82rem] font-bold">{user.documentType} {user.document}</span>
                        <span className="text-[#2a2a50] text-[0.82rem] font-bold">{user.email}</span>
                        <span className="bg-[rgba(120,100,220,0.2)] text-[#3b2090] text-[0.72rem] font-extrabold px-3 py-0.5 rounded-full w-fit">
                            {user.userType || "Administrador"}
                        </span>
                    </div>
                </div>

                <hr className="border-[rgba(255,255,255,0.4)]" />

                {/* Sección 1 — Identidad */}
                <div>
                    <SectionHeader number={1} title="Identidad" color="#7c3aed" />
                    <div className="grid grid-cols-4 gap-3">
                        <Field label="Nombre"             value={user.name}         />
                        <Field label="Tipo de documento"  value={user.documentType} />
                        <Field label="Número de documento" value={user.document}    />
                        <Field label="Tipo de usuario"    value={user.userType}     />
                    </div>
                </div>

                {/* Sección 2 — Contacto */}
                <div>
                    <SectionHeader number={2} title="Contacto" color="#0891b2" />
                    <div className="grid grid-cols-5 gap-3">
                        <Field label="Correo electrónico"    value={user.email}              />
                        <Field label="Confirmación de correo" value={user.email}             />
                        <Field label="Teléfono de contacto"  value={user.phone}              />
                        <Field label="Dirección"             value={user.address}             />
                        <Field label="Correo institucional"  value={user.emailInstitutional}  />
                    </div>
                </div>

                {/* Sección 3 — Cuenta y vigencia */}
                <div>
                    <SectionHeader number={3} title="Cuenta y vigencia" color="#059669" />
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Fecha inicio"       value={formatDate(user.startDate)} />
                        <Field label="Fecha finalización" value={formatDate(user.endDate)}   />
                        <Field label="Grupo asignado"     value={user.group}     />
                    </div>
                </div>

                <hr className="border-[rgba(255,255,255,0.4)]" />

                {/* Botones */}
                <div className="flex">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/dashboard/userpage/edit", { state: { user } })}
                    >
                        Editar perfil
                    </Button>
                </div>

            </div>
        </div>
    );
}
