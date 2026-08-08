const API_URL = "http://localhost:4000/api/notifications";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

/** Obtener todas mis notificaciones */
export async function getMyNotifications() {
  const res = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener notificaciones");
  return res.json();
}

/** Conteo de no leídas */
export async function getUnreadCount() {
  const res = await fetch(`${API_URL}/unread-count`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener conteo");
  const json = await res.json();
  return json.count;
}

/** Marcar una notificación como leída */
export async function markNotificationRead(id) {
  const res = await fetch(`${API_URL}/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al marcar notificación");
  return res.json();
}

/** Últimos 5 préstamos (solo admins) */
export async function getRecentLoans() {
  const res = await fetch(`${API_URL}/recent-loans`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener préstamos recientes");
  return res.json();
}

/** Marcar todas como leídas */
export async function markAllNotificationsRead() {
  const res = await fetch(`${API_URL}/read-all`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al marcar notificaciones");
  return res.json();
}
