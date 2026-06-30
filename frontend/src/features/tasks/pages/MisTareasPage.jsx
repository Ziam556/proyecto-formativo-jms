import { useState, useEffect } from "react";
import { Button, FileInput, BackButton, Textarea, alertSuccess, alertError } from "@/shared";
import { getMyTasks, completeTask, retryTask } from "../services/taskService";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_COLORS = {
  alta:  "bg-red-500",
  media: "bg-yellow-400",
  baja:  "bg-green-500",
};

const PRIORITY_DOT = {
  alta:  "text-red-500",
  media: "text-yellow-500",
  baja:  "text-green-500",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ── Modal de evidencia ────────────────────────────────────────────────────────

function EvidenceModal({ task, onClose, onCompleted }) {
  const [files, setFiles]             = useState([]);
  const [userComment, setUserComment] = useState("");
  const [sending, setSending]         = useState(false);

  const handleSend = async () => {
    try {
      setSending(true);
      await completeTask(task.task_id, files, userComment);
      await alertSuccess("¡Tarea enviada!", "Tu tarea fue enviada para verificación del administrador.");
      onCompleted();
    } catch (err) {
      alertError("Error", err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[480px] p-6 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-[1rem]">Marcar como realizada</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-[1.2rem] leading-none">✕</button>
        </div>

        <div className="bg-gray-50 rounded-[10px] p-3">
          <p className="font-semibold text-gray-800 text-[0.9rem]">{task.task_name}</p>
          <p className="text-gray-500 text-[0.8rem] mt-1">{task.task_description}</p>
        </div>

        {/* Comentario del usuario */}
        <Textarea
          variant="light"
          label="Comentario (opcional)"
          rows={3}
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="Describe lo que realizaste, observaciones, etc."
        />

        <div className="flex flex-col gap-2">
          <label className="text-[0.85rem] font-semibold text-gray-700">
            Adjunta evidencia <span className="text-gray-400 font-normal">(imágenes o archivos — opcional)</span>
          </label>
          <FileInput
            value={files}
            onChange={setFiles}
            accept="image/*,application/pdf,.xlsx,.xls,.doc,.docx"
            multiple
          />
        </div>

        <div className="flex gap-3 mt-1">
          <Button variant="secondary" onClick={onClose} disabled={sending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={sending}>
            {sending ? "Enviando..." : "Enviar tarea"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta de tarea pendiente ────────────────────────────────────────────────

function PendingCard({ task, onMarkDone }) {
  const isRejected = task.status === "rechazada";

  return (
    <div className={`bg-white rounded-[14px] p-4 flex flex-col gap-3 shadow-sm border-l-4 ${isRejected ? "border-red-500" : "border-transparent"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-[0.92rem] truncate">{task.task_name}</p>
          <p className="text-gray-500 text-[0.8rem] mt-[2px] line-clamp-2">{task.task_description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority] ?? "bg-gray-400"}`} />
          <span className={`text-[0.75rem] font-medium capitalize ${PRIORITY_DOT[task.priority] ?? "text-gray-500"}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Fecha límite */}
      {task.due_date && (
        <p className="text-[0.75rem] text-gray-400">
          📅 Límite: <span className="font-medium text-gray-600">{formatDate(task.due_date)}</span>
        </p>
      )}

      {/* Banner de rechazo */}
      {isRejected && task.admin_comment && (
        <div className="bg-red-50 border border-red-200 rounded-[8px] p-3">
          <p className="text-red-600 text-[0.78rem] font-semibold mb-1">Requiere correcciones</p>
          <p className="text-red-500 text-[0.78rem]">{task.admin_comment}</p>
        </div>
      )}

      <Button variant="primary" onClick={() => onMarkDone(task)}>
        {isRejected ? "Volver a realizar" : "Marcar como realizada"}
      </Button>
    </div>
  );
}

// ── Tarjeta de tarea por verificar ───────────────────────────────────────────

function VerifyingCard({ task }) {
  return (
    <div className="bg-white rounded-[14px] p-4 flex flex-col gap-3 shadow-sm">
      <p className="font-bold text-gray-900 text-[0.92rem]">{task.task_name}</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-3 flex items-center gap-2">
        <span className="text-yellow-500 text-[1rem]">⏳</span>
        <p className="text-yellow-700 text-[0.82rem] font-semibold">Esperando verificación</p>
      </div>
      <p className="text-gray-400 text-[0.78rem]">
        Has marcado esta tarea como realizada. Tu administrador revisará el trabajo.
      </p>
      {task.user_comment && (
        <div className="bg-gray-50 rounded-[8px] p-3">
          <p className="text-[0.75rem] font-semibold text-gray-500 mb-1">Tu comentario:</p>
          <p className="text-gray-700 text-[0.8rem] italic">"{task.user_comment}"</p>
        </div>
      )}
      {task.completed_at && (
        <p className="text-gray-400 text-[0.75rem]">
          Fecha: <span className="font-medium text-gray-600">{formatDate(task.completed_at)}</span>
        </p>
      )}
    </div>
  );
}

// ── Tarjeta de tarea completada ───────────────────────────────────────────────

function CompletedCard({ task }) {
  return (
    <div className="bg-white rounded-[14px] p-4 flex flex-col gap-3 shadow-sm">
      <p className="font-bold text-gray-900 text-[0.92rem]">{task.task_name}</p>
      <div className="bg-green-50 border border-green-200 rounded-[10px] p-3 flex items-center gap-2">
        <span className="text-green-500 text-[1rem]">✅</span>
        <p className="text-green-700 text-[0.82rem] font-semibold">Verificada</p>
      </div>
      {task.verified_at && (
        <p className="text-gray-400 text-[0.75rem]">
          Fecha: <span className="font-medium text-gray-600">{formatDate(task.verified_at)}</span>
        </p>
      )}
      {task.verified_by && (
        <p className="text-gray-400 text-[0.75rem]">
          Verificado por: <span className="font-medium text-gray-600">{task.verified_by}</span>
        </p>
      )}
      {task.admin_comment && (
        <div className="bg-gray-50 rounded-[8px] p-2">
          <p className="text-gray-600 text-[0.78rem] italic">"{task.admin_comment}" ✅</p>
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

const TABS = [
  { key: "pendientes",     label: "Pendientes"     },
  { key: "por_verificar",  label: "Por verificar"  },
  { key: "completadas",    label: "Completadas"    },
];

export default function MisTareasPage() {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("pendientes");
  const [evidenceTask, setEvidenceTask] = useState(null); // tarea para el modal

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyTasks();
      setTasks(data);
    } catch (err) {
      alertError("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  // Separar por estado
  const pending    = tasks.filter((t) => t.status === "pendiente" || t.status === "rechazada");
  const verifying  = tasks.filter((t) => t.status === "por_verificar");
  const completed  = tasks.filter((t) => t.status === "completada");

  const counts = { pendientes: pending.length, por_verificar: verifying.length, completadas: completed.length };

  const handleCompleted = () => {
    setEvidenceTask(null);
    loadTasks();
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-8 px-5 sm:px-8 w-full max-w-[680px]">

        <div className="flex items-center gap-2 mb-5">
          <BackButton to="/dashboard/home" />
          <h2 className="text-white font-bold text-[1.2rem]">Mis tareas</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[rgba(0,0,0,0.2)] rounded-[10px] p-1 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-[8px] text-[0.82rem] font-semibold transition-colors border-0 cursor-pointer flex items-center justify-center gap-1
                ${activeTab === tab.key
                  ? "bg-white text-[#700D7C] shadow-sm"
                  : "bg-transparent text-[rgba(255,255,255,0.7)] hover:text-white"}`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-[0.7rem] font-bold px-[5px] py-[1px] rounded-full
                  ${activeTab === tab.key ? "bg-[#700D7C] text-white" : "bg-[rgba(255,255,255,0.25)] text-white"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {loading ? (
          <p className="text-white text-center py-8 text-[0.9rem]">Cargando tareas...</p>
        ) : (
          <div className="flex flex-col gap-3" style={{ maxHeight: "500px", overflowY: "auto" }}>

            {activeTab === "pendientes" && (
              pending.length === 0
                ? <p className="text-[rgba(255,255,255,0.55)] text-center py-8 text-[0.88rem]">No tienes tareas pendientes 🎉</p>
                : pending.map((t) => (
                    <PendingCard key={t.task_id} task={t} onMarkDone={setEvidenceTask} />
                  ))
            )}

            {activeTab === "por_verificar" && (
              verifying.length === 0
                ? <p className="text-[rgba(255,255,255,0.55)] text-center py-8 text-[0.88rem]">Ninguna tarea esperando verificación</p>
                : verifying.map((t) => (
                    <VerifyingCard key={t.task_id} task={t} />
                  ))
            )}

            {activeTab === "completadas" && (
              completed.length === 0
                ? <p className="text-[rgba(255,255,255,0.55)] text-center py-8 text-[0.88rem]">Aún no tienes tareas completadas</p>
                : completed.map((t) => (
                    <CompletedCard key={t.task_id} task={t} />
                  ))
            )}

          </div>
        )}
      </div>

      {/* Modal evidencia */}
      {evidenceTask && (
        <EvidenceModal
          task={evidenceTask}
          onClose={() => setEvidenceTask(null)}
          onCompleted={handleCompleted}
        />
      )}
    </div>
  );
}
