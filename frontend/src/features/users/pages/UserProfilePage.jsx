import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Lock,
  Settings,
  Pencil,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { users } from "../data/users";
import { ActionBtn, BackButton } from "@/shared";

// ─── Usuario "logueado" (mock) ────────────────────────────────────────────────
const LOGGED_USER = users[0];

// ─── Fila de información con ícono ───────────────────────────────────────────
function InfoRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-3 text-black">
      <Icon size={22} className="flex-shrink-0 text-black/70" />
      <span className="text-[0.95rem] font-semibold truncate">{value || "—"}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const navigate = useNavigate();
  const user = LOGGED_USER;

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col box-border py-6 px-4 sm:px-10 gap-3 items-center justify-center">

      {/* ── Contenedor exterior (capa 1) ── */}
      <div className="w-full max-w-[860px] rounded-2xl bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] shadow-[0_8px_40px_rgba(0,0,0,0.3)] relative pt-10 px-6 sm:px-10 pb-8">

        {/* Flecha regresar */}
        <BackButton dark />

        {/* ── Contenedor interior (capa 2) ── */}
        <div className="w-full rounded-xl bg-[rgba(255,255,255,0.31)] py-8 px-6 sm:px-10">

          {/* Encabezado: avatar + nombre */}
          <div className="flex flex-col items-end gap-2 mb-8">
            <div className="relative">
              <CircleUserRound size={76} className="text-black" strokeWidth={1.4} />
              <span className="absolute bottom-1 right-0 w-[15px] h-[15px] rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <span className="text-black font-bold text-[1.15rem]">@{user.name}</span>
          </div>

          {/* Campos de información */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 mb-8">
            <InfoRow icon={User}        value={`@${user.name}`} />
            <InfoRow icon={CreditCard}  value={`${user.documentType} ${user.document}`} />
            <InfoRow icon={MapPin}      value={user.address} />

            <InfoRow icon={Phone}       value={user.phone} />
            <InfoRow icon={Mail}        value={user.email} />
            <InfoRow icon={ShieldCheck} value={`@${user.userType ?? "Cliente"}`} />

            <InfoRow icon={Mail}        value={user.emailInstitutional ?? "UserInstitutional@email.com"} />
          </div>

          <hr className="border-black/20 mb-6" />

          {/* Botones de acción (2 × 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <ActionBtn icon={Lock}     label="Cambiar contraseña" onClick={() => {}} />
            <ActionBtn icon={Settings} label="Configuración"      onClick={() => navigate("/dashboard/config")} />
            <ActionBtn icon={Pencil}   label="Editar Perfil"      onClick={() => navigate("/dashboard/userpage/edit", { state: { user } })} />
            <ActionBtn icon={LogOut}   label="Cerrar sesión"      onClick={() => navigate("/auth")} danger />
          </div>

          {/* Fechas */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-black text-[0.9rem]">
              <CalendarDays size={17} />
              <span>Fecha inicio: <strong>{user.startDate ?? "00/00/0000"}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-black text-[0.9rem]">
              <CalendarDays size={17} />
              <span>Fecha finalización: <strong>{user.endDate ?? "00/00/0000"}</strong></span>
            </div>
          </div>

        </div>{/* fin capa 2 */}
      </div>{/* fin capa 1 */}

    </div>
  );
}
