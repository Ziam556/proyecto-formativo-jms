import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { IconButton, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, alertContact } from "@/shared";
import logo from "@/assets/images/logo-1.png";
import { CircleUserRound, Bell, House } from "lucide-react";
import { handleLogout } from "@/features/auth/services/logoutService";
import { usePermissions } from "@/shared/hooks/usePermissions";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  getRecentLoans,
} from "@/features/notifications/services/notificationService";

// ── Formato de tiempo relativo ────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} d`;
}

// ── Chip de estado de préstamo ────────────────────────────────────────────────

const LOAN_STATUS_STYLES = {
  activo:    "bg-blue-100 text-blue-700",
  devuelto:  "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-600",
};

// ── Panel de notificaciones ───────────────────────────────────────────────────

function NotificationPanel({ notifications, recentLoans, onMarkAll, onMarkOne, onClose }) {
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div
      className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-white rounded-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.25)] overflow-hidden z-50 border border-gray-100"
      style={{ maxHeight: "520px", display: "flex", flexDirection: "column" }}
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-bold text-gray-900 text-[0.95rem]">
          Notificaciones
          {unread > 0 && (
            <span className="ml-2 text-[0.72rem] font-semibold bg-purple-600 text-white px-2 py-[2px] rounded-full">
              {unread} nuevas
            </span>
          )}
        </span>
        {unread > 0 && (
          <button
            onClick={onMarkAll}
            className="text-[0.75rem] text-purple-600 font-medium bg-transparent border-0 cursor-pointer hover:underline"
          >
            Marcar todo como leído
          </button>
        )}
      </div>

      {/* Lista scroll */}
      <div style={{ overflowY: "auto", flex: 1 }}>

        {/* ── Notificaciones de tareas ── */}
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 text-[0.85rem] py-6">
            Sin notificaciones
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notification_id}
              onClick={() => !n.is_read && onMarkOne(n.notification_id)}
              className={`px-4 py-3 border-b border-gray-50 last:border-0 flex gap-3 cursor-default transition-colors
                ${!n.is_read ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"}`}
            >
              <div className="pt-[6px] shrink-0">
                <div className={`w-2 h-2 rounded-full ${!n.is_read ? "bg-purple-500" : "bg-transparent"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[0.83rem] leading-snug ${!n.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                  {n.title}
                </p>
                {n.message && (
                  <p className="text-[0.77rem] text-gray-500 mt-[2px] leading-snug line-clamp-2">
                    {n.message}
                  </p>
                )}
                <p className="text-[0.7rem] text-gray-400 mt-[4px]">
                  {timeAgo(n.created_at)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* ── Sección últimos préstamos (solo admins) ── */}
        {recentLoans && recentLoans.length > 0 && (
          <>
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 flex items-center gap-2">
              <span className="text-[0.72rem] font-bold text-gray-500 uppercase tracking-wider">
                Últimos préstamos
              </span>
            </div>
            {recentLoans.map((loan) => (
              <div
                key={loan.loan_id}
                className="px-4 py-3 border-b border-gray-50 last:border-0 flex gap-3 hover:bg-gray-50 transition-colors"
              >
                {/* Dot decorativo */}
                <div className="pt-[6px] shrink-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[0.83rem] font-semibold text-gray-900 leading-snug truncate">
                      {loan.requesting_user}
                    </p>
                    <span className={`text-[0.65rem] font-bold px-[6px] py-[2px] rounded-full shrink-0 ${LOAN_STATUS_STYLES[loan.loan_status] ?? "bg-gray-100 text-gray-600"}`}>
                      {loan.loan_status}
                    </span>
                  </div>
                  {loan.file_group && (
                    <p className="text-[0.75rem] text-gray-500 mt-[2px] truncate">
                      Ficha: {loan.file_group}
                    </p>
                  )}
                  <p className="text-[0.7rem] text-gray-400 mt-[3px]">
                    {timeAgo(loan.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export default function Header() {
  const navigate      = useNavigate();
  const { isAdmin, hasPermission } = usePermissions();
  const showConfig = isAdmin || hasPermission(["create_brand","list_brand","edit_brand","toggle_brand","delete_brand"]);

  const [showNotifs, setShowNotifs]       = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [recentLoans, setRecentLoans]     = useState([]);
  const bellRef                           = useRef(null);

  // Cargar notificaciones (+ préstamos si es admin)
  const loadNotifs = useCallback(async () => {
    try {
      const promises = [getMyNotifications(), getUnreadCount()];
      if (isAdmin) promises.push(getRecentLoans());

      const [notifs, count, loans] = await Promise.all(promises);
      setNotifications(notifs);
      setUnreadCount(count);
      if (isAdmin && loans) setRecentLoans(loans);
    } catch {
      // silencioso — puede que el token no esté listo aún
    }
  }, [isAdmin]);

  // Polling cada 30 segundos
  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 30_000);
    return () => clearInterval(interval);
  }, [loadNotifs]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBellClick = () => {
    setShowNotifs((prev) => !prev);
  };

  const handleMarkOne = async (id) => {
    await markNotificationRead(id).catch(console.error);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead().catch(console.error);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <nav className="w-full bg-[linear-gradient(90deg,#5b2d8e_0%,#3a6ea8_100%)] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between h-[64px] md:h-[72px] px-4 md:px-8">

        {/* Logo + título */}
        <Link
          to="/dashboard/home"
          className="flex items-center gap-[10px] md:gap-[14px] no-underline text-white min-w-0"
        >
          <img src={logo} alt="SENA" className="h-9 md:h-11 flex-shrink-0" />
          <span className="font-semibold text-[0.95rem] md:text-[1.15rem] tracking-[0.01em] truncate hidden sm:block">
            InfraSys
          </span>
        </Link>

        {/* Campana + usuario */}
        <div className="flex items-center gap-2">

          {/* Campana de notificaciones */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={handleBellClick}
              aria-label="Notificaciones"
              className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.15)] transition-colors bg-transparent border-0 cursor-pointer"
            >
              <Bell size={24} color="#fff" />
              {unreadCount > 0 && (
                <span className="absolute top-[6px] right-[6px] min-w-[16px] h-[16px] bg-[#FDC300] text-black text-[0.62rem] font-bold rounded-full flex items-center justify-center px-[3px] leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <NotificationPanel
                notifications={notifications}
                recentLoans={isAdmin ? recentLoans : []}
                onMarkAll={handleMarkAll}
                onMarkOne={handleMarkOne}
                onClose={() => setShowNotifs(false)}
              />
            )}
          </div>

          {/* Casita — ir al menú principal */}
          <button
            onClick={() => navigate("/dashboard/home")}
            aria-label="Menú principal"
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.15)] transition-colors bg-transparent border-0 cursor-pointer"
          >
            <House size={24} color="#fff" />
          </button>

          {/* Ícono usuario con dropdown */}
          <Dropdown>
            <DropdownTrigger>
              <IconButton ariaLabel="Menú de usuario" hitSize={44} iconSize={32}>
                <CircleUserRound size={32} color="#fff" />
              </IconButton>
            </DropdownTrigger>

            <DropdownContent className="right-0 w-48">
              <DropdownItem>
                <Link to="/dashboard/userpage/profile" className="block w-full">
                  Ver perfil
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/dashboard/mis-tareas" className="block w-full">
                  Mis tareas
                </Link>
              </DropdownItem>
              {showConfig && (
                <DropdownItem>
                  <Link to="/dashboard/config" className="block w-full">
                    Configuración
                  </Link>
                </DropdownItem>
              )}
              <DropdownItem>
                <button
                  onClick={() => alertContact()}
                  className="block w-full text-left"
                >
                  Contáctanos
                </button>
              </DropdownItem>
              <DropdownItem>
                <button
                  onClick={() => handleLogout(navigate)}
                  className="block w-full text-left"
                >
                  Cerrar sesión
                </button>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>

      </div>
    </nav>
  );
}
