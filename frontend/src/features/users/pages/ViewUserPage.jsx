import { useParams, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { users } from "../data/users";

// ─── Campo de solo lectura reutilizable ───────────────────────────────────────
function ViewField({ label, value, accentColor = "#a78bfa" }) {
    return (
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.25)] rounded-xl px-4 py-3 min-w-0">
            <div
                className="w-[10px] h-[10px] rounded-sm flex-shrink-0"
                style={{ backgroundColor: accentColor }}
            />
            <div className="flex flex-col min-w-0">
                <span className="text-[0.7rem] text-[#3d3d6b] font-semibold leading-none mb-1">{label}</span>
                <span className="text-[0.85rem] text-[#2d2d5e] font-medium truncate">{value || "—"}</span>
            </div>
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
    const user = users.find((u) => String(u.id) === String(id));

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <p className="text-white text-lg">Usuario no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center px-6 py-6 gap-4">

            {/* Título */}
            <h1 className="text-white text-[1.1rem] font-semibold tracking-wide">
                Visualizar usuario
            </h1>

            {/* Tarjeta principal */}
            <div className="w-full max-w-[1400px] bg-[rgba(200,195,240,0.45)] backdrop-blur-[16px] rounded-2xl border border-[rgba(255,255,255,0.3)] p-6 flex flex-col gap-5">

                {/* Perfil */}
                <div className="flex items-center gap-4">
                    <div className="w-[72px] h-[72px] rounded-full bg-[rgba(255,255,255,0.4)] border-2 border-white flex items-center justify-center flex-shrink-0">
                        <User size={36} className="text-[#6b6b9a]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#1a1a3e] font-bold text-[1rem]">@{user.name}</span>
                        <span className="text-[#2a2a50] text-[0.82rem]">{user.documentType} {user.document}</span>
                        <span className="text-[#2a2a50] text-[0.82rem]">{user.email}</span>
                        <span className="bg-[rgba(120,100,220,0.2)] text-[#3b2090] text-[0.72rem] font-semibold px-3 py-0.5 rounded-full w-fit">
                            {user.userType || "Administrador"}
                        </span>
                    </div>
                </div>

                <hr className="border-[rgba(255,255,255,0.4)]" />

                {/* Sección 1 — Identidad */}
                <div>
                    <SectionHeader number={1} title="Identidad" color="#7c3aed" />
                    <div className="grid grid-cols-4 gap-3">
                        <ViewField label="Nombre"             value={user.name}         accentColor="#7c3aed" />
                        <ViewField label="Tipo de documento"  value={user.documentType} accentColor="#7c3aed" />
                        <ViewField label="Número de documento" value={user.document}    accentColor="#7c3aed" />
                        <ViewField label="Tipo de usuario"    value={user.userType}     accentColor="#7c3aed" />
                    </div>
                </div>

                {/* Sección 2 — Contacto */}
                <div>
                    <SectionHeader number={2} title="Contacto" color="#0891b2" />
                    <div className="grid grid-cols-5 gap-3">
                        <ViewField label="Correo electrónico"    value={user.email}              accentColor="#67e8f9" />
                        <ViewField label="Confirmación de correo" value={user.email}             accentColor="#67e8f9" />
                        <ViewField label="Teléfono de contacto"  value={user.phone}              accentColor="#67e8f9" />
                        <ViewField label="Dirección"             value={user.address}             accentColor="#67e8f9" />
                        <ViewField label="Correo institucional"  value={user.emailInstitutional}  accentColor="#67e8f9" />
                    </div>
                </div>

                {/* Sección 3 — Cuenta y vigencia */}
                <div>
                    <SectionHeader number={3} title="Cuenta y vigencia" color="#059669" />
                    <div className="grid grid-cols-3 gap-3">
                        <ViewField label="Fecha inicio"       value={user.startDate} accentColor="#6ee7b7" />
                        <ViewField label="Fecha finalización" value={user.endDate}   accentColor="#6ee7b7" />
                        <ViewField label="Grupo asignado"     value={user.group}     accentColor="#6ee7b7" />
                    </div>
                </div>

                <hr className="border-[rgba(255,255,255,0.4)]" />

                {/* Botones */}
                <div className="flex">
                    <button
                        onClick={() => navigate(`/dashboard/userpage/${user.id}/edit`)}
                        className="py-3 px-8 rounded-xl bg-[rgba(120,100,220,0.3)] text-[#1a1a3e] font-semibold text-[0.9rem] hover:bg-[rgba(120,100,220,0.45)] transition-colors"
                    >
                        Editar perfil
                    </button>
                </div>

            </div>
        </div>
    );
}
