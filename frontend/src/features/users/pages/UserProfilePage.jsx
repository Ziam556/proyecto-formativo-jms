import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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

const API_BASE = "http://localhost:4000";

// ─── Avatar estático (solo visualización, sin interacción) ───────────────────
function ProfileAvatar({ src, size = 110 }) {
  const iconSize = Math.round(size * 0.46);
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[rgba(200,200,220,0.45)] border-2 border-[rgba(255,255,255,0.6)] overflow-hidden flex items-center justify-center flex-shrink-0"
    >
      {src ? (
        <img src={src} alt="Foto de perfil" className="w-full h-full object-cover" />
      ) : (
        <User size={iconSize} color="rgba(90,90,120,0.7)" />
      )}
    </div>
  );
}
import { ActionBtn, BackButton } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getMyProfile } from "../services/userService";
import { handleLogout } from "@/features/auth/services/logoutService";

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

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((data) => { if (active) { setUser(data); setError(null); } })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col box-border py-6 px-4 sm:px-10 gap-3 items-center justify-center">

      {/* ── Contenedor exterior (capa 1) ── */}
      <div className="w-full max-w-[860px] rounded-2xl bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] shadow-[0_8px_40px_rgba(0,0,0,0.3)] relative pt-10 px-6 sm:px-10 pb-8">

        {/* Flecha regresar */}
        <BackButton dark />

        {/* ── Contenedor interior (capa 2) ── */}
        <div className="w-full rounded-xl bg-[rgba(255,255,255,0.31)] py-8 px-6 sm:px-10">

          {/* Estado de carga */}
          {loading && (
            <p className="text-black/70 text-sm text-center py-8">Cargando perfil...</p>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-red-700 text-sm text-center py-8">No se pudo cargar el perfil: {error}</p>
          )}

          {/* Contenido */}
          {!loading && user && (
            <>
              {/* Encabezado: avatar + nombre */}
              <div className="flex flex-col items-start gap-2 mb-8">
                <div className="relative w-fit">
                  <ProfileAvatar
                    src={user.user_image ? `${API_BASE}/${user.user_image}` : null}
                  />
                  <span className="absolute bottom-1 right-1 w-[14px] h-[14px] rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <span className="text-black font-bold text-[1.15rem]">{user.user_name || "—"}</span>
              </div>

              {/* Campos de información */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 mb-8">
                <InfoRow icon={User}        value={user.user_email} />
                <InfoRow icon={CreditCard}  value={`${user.user_document_type ?? ""} ${user.user_document_number ?? ""}`.trim()} />
                <InfoRow icon={Mail}        value={user.user_email_institutional} />

                <InfoRow icon={Phone}       value={user.user_phone} />
                <InfoRow icon={Mail}        value={user.user_email} />
                <InfoRow icon={ShieldCheck} value={user.user_group ? `@${user.user_group}` : "—"} />

                <InfoRow icon={MapPin}      value={user.user_address} />
              </div>

              <hr className="border-black/20 mb-6" />

              {/* Botones de acción (2 × 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ActionBtn icon={Lock}     label="Cambiar contraseña" onClick={() => {}} />
                <ActionBtn icon={Settings} label="Configuración"      onClick={() => navigate("/dashboard/config")} />
                <ActionBtn icon={Pencil}   label="Editar Perfil"      onClick={() => navigate("/dashboard/userpage/edit", { state: { user } })} />
                <ActionBtn icon={LogOut}   label="Cerrar sesión"      onClick={() => handleLogout(navigate)} danger />
              </div>

              {/* Fechas */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-black text-[0.9rem]">
                  <CalendarDays size={17} />
                  <span>Fecha inicio: <strong>{formatDate(user.start_date)}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-black text-[0.9rem]">
                  <CalendarDays size={17} />
                  <span>Fecha finalización: <strong>{formatDate(user.end_date)}</strong></span>
                </div>
              </div>
            </>
          )}

        </div>{/* fin capa 2 */}
      </div>{/* fin capa 1 */}

    </div>
  );
}
