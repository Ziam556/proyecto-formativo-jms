const API_URL = "/api/tasks";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

/** Listar todas las tareas (admin). Acepta filtros opcionales: { status, search } */
export async function getTasks({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "todos") params.append("status", status);
  if (search) params.append("search", search);
  const url = `${API_URL}${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

/** Obtener detalle de una tarea con sus evidencias */
export async function getTaskById(taskId) {
  const res = await fetch(`${API_URL}/${taskId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener la tarea");
  return res.json();
}

/** Tareas asignadas al usuario autenticado */
export async function getMyTasks() {
  const res = await fetch(`${API_URL}/my-tasks`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener mis tareas");
  return res.json();
}

/** Crear tarea (admin) */
export async function createTask(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al crear la tarea");
  return json;
}

/** Marcar tarea como completada + evidencias (FormData) */
export async function completeTask(taskId, files = [], userComment = "") {
  const formData = new FormData();
  files.forEach((f) => formData.append("evidence", f));
  if (userComment) formData.append("userComment", userComment);
  const res = await fetch(`${API_URL}/${taskId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(), // sin Content-Type: multer lo pone solo
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al completar la tarea");
  return json;
}

/** Verificar tarea (admin): action = 'aprobar' | 'rechazar' */
export async function verifyTask(taskId, { action, adminComment }) {
  const res = await fetch(`${API_URL}/${taskId}/verify`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ action, adminComment }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al verificar la tarea");
  return json;
}

/** Reintentar tarea rechazada (usuario) */
export async function retryTask(taskId) {
  const res = await fetch(`${API_URL}/${taskId}/retry`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al reintentar la tarea");
  return json;
}

export async function deleteTask(taskId) {
  const res  = await fetch(`${API_URL}/${taskId}`, {
    method:  "DELETE",
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Error al eliminar la tarea");
  return json;
}
