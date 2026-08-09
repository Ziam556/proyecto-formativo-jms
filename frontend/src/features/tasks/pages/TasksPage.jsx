import { useState, useEffect, useCallback } from "react";
import { Input, Button, Select, Textarea, DatePicker, MultiUserSearchField, StatsPills, BackButton, alertSuccess, alertError, alertConfirm } from "@/shared";
import { getGroups } from "@/features/groups/services/groupService";
import { getTasks, createTask, verifyTask, getTaskById } from "../services/taskService";
import { X } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  pendiente:     { bg: "bg-[#71277A]/15", text: "text-[#71277A]",   label: "Pendiente"     },
  por_verificar: { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "Por verificar" },
  completada:    { bg: "bg-green-100",   text: "text-green-700",   label: "Completada"    },
  rechazada:     { bg: "bg-red-100",     text: "text-red-700",     label: "Rechazada"     },
};

const PRIORITY_COLORS = {
  alta:  "bg-red-500",
  media: "bg-yellow-400",
  baja:  "bg-green-500",
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] ?? { bg: "bg-gray-100", text: "text-gray-600", label: status };
  return (
    <span className={`text-[0.75rem] font-semibold px-3 py-[3px] rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

const PRIORITY_OPTIONS = [
  { value: "baja",  label: "Baja"  },
  { value: "media", label: "Media" },
  { value: "alta",  label: "Alta"  },
];

const STATUS_FILTER_OPTIONS = [
  { value: "todos",         label: "Todos los estados" },
  { value: "pendiente",     label: "Pendiente"         },
  { value: "por_verificar", label: "Por verificar"     },
  { value: "completada",    label: "Completada"        },
  { value: "rechazada",     label: "Rechazada"         },
];

const EMPTY_FORM = {
  taskName:        "",
  taskDescription: "",
  assignedType:    "user",
  assignedUsers:   [],   // [{ name, document, userId }]
  assignedGroups:  [],   // [{ group_id, group_name }]
  priority:        "media",
  dueDate:         "",
};

// ── Componente principal ──────────────────────────────────────────────────────

export default function TasksPage() {
  // Formulario
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating]   = useState(false);

  // Datos externos
  const [groups, setGroups] = useState([]);

  // Lista de tareas
  const [tasks, setTasks]         = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch]             = useState("");

  // Panel verificar
  const [verifyTask_,   setVerifyTask_]   = useState(null); // tarea seleccionada para verificar
  const [adminComment,  setAdminComment]  = useState("");
  const [verifying,     setVerifying]     = useState(false);

  // ── Carga inicial ──────────────────────────────────────────────
  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(console.error);
  }, []);

  const loadTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const data = await getTasks({ status: statusFilter, search });
      setTasks(data);
    } catch (err) {
      alertError("Error", err.message);
    } finally {
      setLoadingTasks(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Opciones para selects ──────────────────────────────────────
  const groupOptions = groups.map((g) => ({
    value: g.group_name,
    label: g.group_name,
  }));

  // ── Formulario ─────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.taskName.trim())        errors.taskName        = "El nombre es requerido";
    if (!form.taskDescription.trim()) errors.taskDescription = "La descripción es requerida";
    if (form.assignedType === "user"  && form.assignedUsers.length  === 0) errors.assignedUsers  = "Selecciona al menos un usuario";
    if (form.assignedType === "group" && form.assignedGroups.length === 0) errors.assignedGroups = "Selecciona al menos un grupo";
    return errors;
  };

  const handleCreate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    try {
      setCreating(true);
      // Crear una tarea por cada asignado
      const assignees = form.assignedType === "user"
        ? form.assignedUsers.map((u) => ({ assignedType: "user",  assignedUserDoc: u.document, assignedGroupName: "" }))
        : form.assignedGroups.map((g) => ({ assignedType: "group", assignedUserDoc: "",          assignedGroupName: g.group_name }));

      await Promise.all(assignees.map((a) => createTask({ ...form, ...a })));

      const total = assignees.length;
      await alertSuccess("¡Tarea(s) creada(s)!", `Se crearon ${total} tarea(s) "${form.taskName}" correctamente.`);
      setForm(EMPTY_FORM);
      setFormErrors({});
      loadTasks();
    } catch (err) {
      alertError("Error al crear", err.message);
    } finally {
      setCreating(false);
    }
  };

  // ── Verificar ──────────────────────────────────────────────────
  const openVerify = async (taskId) => {
    try {
      const task = await getTaskById(taskId);
      setVerifyTask_(task);
      setAdminComment("");
    } catch (err) {
      alertError("Error", err.message);
    }
  };

  const handleVerify = async (action) => {
    if (!verifyTask_) return;
    const label = action === "aprobar" ? "aprobar" : "rechazar";
    const confirmed = await alertConfirm(`¿${label.charAt(0).toUpperCase() + label.slice(1)} tarea?`,
      `¿Seguro que deseas ${label} "${verifyTask_.task_name}"?`);
    if (!confirmed.isConfirmed) return;
    try {
      setVerifying(true);
      await verifyTask(verifyTask_.task_id, { action, adminComment });
      await alertSuccess("¡Listo!", `Tarea ${action === "aprobar" ? "aprobada" : "rechazada"} correctamente.`);
      setVerifyTask_(null);
      loadTasks();
    } catch (err) {
      alertError("Error", err.message);
    } finally {
      setVerifying(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-6">

        {/* ── Encabezado ── */}
        <div className="flex items-center gap-3">
          <BackButton to="/dashboard/config" />
          <div>
            <h1 className="text-white text-[1.4rem] font-bold">Gestión de tareas</h1>
            <p className="text-[rgba(255,255,255,0.55)] text-[0.82rem] mt-[2px]">
              Configuración › Gestión de tareas
            </p>
          </div>
        </div>

        {/* ── Resumen de estados ── */}
        {!loadingTasks && (
          <StatsPills stats={[
            { label: "Pendientes",  count: tasks.filter(t => t.status === "pendiente").length,     color: "#71277A" },
            { label: "Verificando", count: tasks.filter(t => t.status === "por_verificar").length, color: "#eab308" },
            { label: "Completadas", count: tasks.filter(t => t.status === "completada").length,    color: "#16a34a" },
            { label: "Rechazadas",  count: tasks.filter(t => t.status === "rechazada").length,     color: "#ef4444" },
          ]} />
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Panel izquierdo: crear tarea ── */}
          <div className="w-full lg:w-[340px] lg:shrink-0">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-6 flex flex-col gap-4">
              <h2 className="text-white font-bold text-[1rem]">Crear nueva tarea</h2>

              <Input
                label="Nombre de la tarea"
                name="taskName"
                placeholder="Ej: Actualizar inventario"
                value={form.taskName}
                onChange={handleFormChange}
                error={formErrors.taskName}
              />

              <Textarea
                label="Descripción"
                name="taskDescription"
                placeholder="Describe los detalles de la tarea..."
                value={form.taskDescription}
                onChange={handleFormChange}
                rows={3}
                error={formErrors.taskDescription}
              />

              {/* Asignar a */}
              <div className="flex flex-col gap-2">
                <span className="text-white text-[0.85rem]">Asignar a</span>
                <div className="flex gap-5">
                  {["user", "group"].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-white text-[0.85rem] cursor-pointer">
                      <input
                        type="radio"
                        name="assignedType"
                        value={type}
                        checked={form.assignedType === type}
                        onChange={(e) => {
                          handleFormChange(e);
                          setForm((prev) => ({ ...prev, assignedUsers: [], assignedGroups: [] }));
                        }}
                        className="accent-[#50E5F9] w-4 h-4 cursor-pointer"
                      />
                      {type === "user" ? "Usuario(s)" : "Grupo(s)"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Multi-selector de usuarios */}
              {form.assignedType === "user" ? (
                <MultiUserSearchField
                  label="Usuarios"
                  value={form.assignedUsers}
                  onChange={(arr) => {
                    setForm((prev) => ({ ...prev, assignedUsers: arr }));
                    setFormErrors((prev) => ({ ...prev, assignedUsers: "" }));
                  }}
                  error={formErrors.assignedUsers}
                />
              ) : (
                /* Multi-selector de grupos */
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-white">
                    Grupos {formErrors.assignedGroups && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <Select
                    name="_groupPicker"
                    value=""
                    options={groupOptions.filter((g) => !form.assignedGroups.find((s) => s.group_name === g.value))}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (!name) return;
                      const grp = groups.find((g) => g.group_name === name);
                      if (!grp) return;
                      setForm((prev) => ({ ...prev, assignedGroups: [...prev.assignedGroups, grp] }));
                      setFormErrors((prev) => ({ ...prev, assignedGroups: "" }));
                    }}
                    placeholder="Agregar grupo..."
                  />
                  {form.assignedGroups.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.assignedGroups.map((g) => (
                        <span key={g.group_id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600/80 text-white text-[0.75rem] font-medium">
                          {g.group_name}
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, assignedGroups: prev.assignedGroups.filter((x) => x.group_id !== g.group_id) }))}
                            className="ml-1 text-white/70 hover:text-white leading-none"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {formErrors.assignedGroups && (
                    <p className="text-red-400 text-[0.75rem]">{formErrors.assignedGroups}</p>
                  )}
                </div>
              )}

              {/* Fecha límite */}
              <DatePicker
                label="Fecha límite (opcional)"
                name="dueDate"
                value={form.dueDate}
                onChange={handleFormChange}
                placeholder="dd/mm/aaaa"
              />

              {/* Prioridad */}
              <div className="flex flex-col gap-2">
                <span className="text-white text-[0.85rem]">Prioridad</span>
                <div className="flex gap-5">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-white text-[0.85rem] cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={opt.value}
                        checked={form.priority === opt.value}
                        onChange={handleFormChange}
                        className="accent-[#50E5F9] w-4 h-4 cursor-pointer"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="primary" onClick={handleCreate} disabled={creating}>
                {creating ? "Creando..." : "Crear tarea"}
              </Button>
            </div>
          </div>

          {/* ── Panel derecho: lista + verificar ── */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar tarea..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-[200px]">
                <Select
                  name="statusFilter"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  placeholder=""
                />
              </div>
            </div>

            {/* Lista de tareas */}
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-5 flex flex-col gap-3 flex-1">
              <h2 className="text-white font-bold text-[1rem] mb-1">Lista de tareas</h2>

              {loadingTasks ? (
                <p className="text-white text-center py-8 text-[0.9rem]">Cargando tareas...</p>
              ) : tasks.length === 0 ? (
                <p className="text-[rgba(255,255,255,0.55)] text-center py-8 text-[0.9rem]">Sin tareas</p>
              ) : (
                <div className="flex flex-col gap-3" style={{ maxHeight: "520px", overflowY: "auto" }}>
                  {tasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="bg-white rounded-[12px] p-4 flex items-start justify-between gap-3 shadow-sm"
                    >
                      {/* Barra de prioridad lateral */}
                      <div className={`w-1 self-stretch rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] ?? "bg-gray-300"}`} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[0.92rem] text-gray-900 truncate">{task.task_name}</p>
                        <p className="text-[0.78rem] text-gray-500 mt-[2px]">
                          Asignada a:{" "}
                          <span className="font-medium text-gray-700">
                            {task.assigned_type === "user"
                              ? (task.assigned_user_name ?? task.assigned_user_doc)
                              : (task.assigned_group_name ?? "—")}
                          </span>
                        </p>
                        {task.due_date && (
                          <p className="text-[0.75rem] text-gray-400 mt-[2px]">
                            Límite: {new Date(task.due_date).toLocaleDateString("es-CO")}
                          </p>
                        )}
                      </div>

                      {/* Estado + prioridad + acción */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={task.status} />
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]}`} />
                          <span className="text-[0.73rem] text-gray-500 capitalize">{task.priority}</span>
                        </div>
                        {task.status === "por_verificar" && (
                          <button
                            onClick={() => openVerify(task.task_id)}
                            className="text-[0.75rem] font-semibold text-[#700D7C] hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Verificar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Panel verificar tarea ── */}
            {verifyTask_ && (
              <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-[1rem]">Verificar tarea</h2>
                  <button
                    onClick={() => setVerifyTask_(null)}
                    className="text-white bg-transparent border-0 cursor-pointer text-[0.8rem] hover:underline"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="bg-white rounded-[12px] p-4 flex flex-col gap-3">
                  <p className="font-bold text-gray-900">{verifyTask_.task_name}</p>
                  <p className="text-[0.82rem] text-gray-500">
                    Usuario: <span className="font-medium text-gray-700">
                      {verifyTask_.assigned_user_name ?? verifyTask_.assigned_user_doc ?? verifyTask_.assigned_group_name}
                    </span>
                  </p>
                  {verifyTask_.completed_at && (
                    <p className="text-[0.82rem] text-gray-500">
                      Fecha enviada:{" "}
                      <span className="font-medium text-gray-700">
                        {new Date(verifyTask_.completed_at).toLocaleString("es-CO")}
                      </span>
                    </p>
                  )}
                  <p className="text-[0.82rem] text-gray-700">{verifyTask_.task_description}</p>

                  {/* Comentario del usuario */}
                  {verifyTask_.user_comment && (
                    <div className="bg-blue-50 border border-blue-100 rounded-[8px] p-3">
                      <p className="text-[0.78rem] font-semibold text-blue-600 mb-1">Comentario del usuario:</p>
                      <p className="text-gray-700 text-[0.82rem] italic">"{verifyTask_.user_comment}"</p>
                    </div>
                  )}

                  {/* Evidencias */}
                  {verifyTask_.evidence?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[0.82rem] font-semibold text-gray-700">Evidencia enviada:</p>
                      <div className="flex flex-wrap gap-3">
                        {verifyTask_.evidence.map((ev) => (
                          ev.file_type === "image" ? (
                            <img
                              key={ev.evidence_id}
                              src={`http://localhost:4000/${ev.file_path}`}
                              alt={ev.file_name}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <a
                              key={ev.evidence_id}
                              href={`http://localhost:4000/${ev.file_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-[0.78rem] text-gray-700 hover:bg-gray-50"
                            >
                              <span>📄</span>
                              <span className="max-w-[120px] truncate">{ev.file_name}</span>
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comentario admin */}
                  <Textarea
                    variant="light"
                    labelVariant="dark"
                    label="Comentario (opcional)"
                    rows={2}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Ej: Falta revisar el pasillo 3..."
                  />

                  <div className="flex gap-3 mt-1">
                    <Button
                      variant="primary"
                      onClick={() => handleVerify("aprobar")}
                      disabled={verifying}
                    >
                      ✓ Aprobar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleVerify("rechazar")}
                      disabled={verifying}
                    >
                      ✕ Rechazar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
