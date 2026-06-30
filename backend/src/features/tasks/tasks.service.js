import { tasksRepository } from "./tasks.repository.js";
import { notificationsService } from "../notifications/notifications.service.js";

export const tasksService = {

  // ── Crear tarea ──────────────────────────────────────────────
  async createTask(data, createdBy) {
    const { taskName, taskDescription, assignedType, assignedUserDoc, assignedGroupName, priority, dueDate } = data;

    let assignedGroupId = null;
    if (assignedType === 'group' && assignedGroupName) {
      assignedGroupId = await tasksRepository.getGroupIdByName(assignedGroupName);
      if (!assignedGroupId) throw new Error(`Grupo "${assignedGroupName}" no encontrado`);
    }

    const task = await tasksRepository.create({
      taskName,
      taskDescription,
      assignedType,
      assignedUserDoc: assignedType === 'user' ? assignedUserDoc : null,
      assignedGroupId,
      priority: priority || 'media',
      dueDate,
      createdBy,
    });

    // Notificar al asignado (sin bloquear la respuesta)
    notificationsService.onTaskCreated(task).catch(console.error);

    return task;
  },

  // ── Listar todas (admin) ─────────────────────────────────────
  async getAll(filters) {
    return tasksRepository.findAll(filters);
  },

  // ── Obtener por ID ───────────────────────────────────────────
  async getById(taskId) {
    const task = await tasksRepository.findById(taskId);
    if (!task) throw new Error("Tarea no encontrada");
    return task;
  },

  // ── Mis tareas (por email del token) ─────────────────────────
  async getMyTasks(email) {
    const userDoc = await tasksRepository.getDocByEmail(email);
    if (!userDoc) throw new Error("Usuario no encontrado");
    return tasksRepository.findByUserDoc(userDoc);
  },

  // ── Marcar como completada + guardar evidencias ───────────────
  async completeTask(taskId, email, files, userComment) {
    const userDoc = await tasksRepository.getDocByEmail(email);
    if (!userDoc) throw new Error("Usuario no encontrado");

    const task = await tasksRepository.findById(taskId);
    if (!task) throw new Error("Tarea no encontrada");
    if (!['pendiente', 'rechazada'].includes(task.status)) {
      throw new Error("Solo se pueden completar tareas en estado Pendiente o Rechazada");
    }

    // Limpiar evidencias anteriores si existían (caso reintento tras rechazo)
    await tasksRepository.clearEvidence(taskId);

    // Guardar nuevas evidencias
    if (files && files.length) {
      const evidenceFiles = files.map((f) => ({
        file_path: f.path.replace(/\\/g, "/"),
        file_name: f.originalname,
        file_type: f.mimetype.startsWith("image/") ? "image" : "file",
      }));
      await tasksRepository.saveEvidence(taskId, evidenceFiles);
    }

    const updated = await tasksRepository.markCompleted(taskId, userDoc, userComment);

    // Notificar al creador de la tarea
    notificationsService.onTaskCompleted({ ...task, ...updated }).catch(console.error);

    return updated;
  },

  // ── Verificar tarea (admin) ──────────────────────────────────
  async verifyTask(taskId, { action, adminComment }, verifiedBy) {
    const task = await tasksRepository.findById(taskId);
    if (!task) throw new Error("Tarea no encontrada");
    if (task.status !== 'por_verificar') {
      throw new Error("Solo se pueden verificar tareas en estado Por verificar");
    }
    const updated = await tasksRepository.verify(taskId, { action, adminComment, verifiedBy });

    // Notificar al usuario que completó la tarea
    notificationsService.onTaskVerified({ ...task, ...updated }).catch(console.error);

    return updated;
  },

  // ── Reintentar tarea rechazada ───────────────────────────────
  async retryTask(taskId, email) {
    const userDoc = await tasksRepository.getDocByEmail(email);
    if (!userDoc) throw new Error("Usuario no encontrado");

    const task = await tasksRepository.findById(taskId);
    if (!task) throw new Error("Tarea no encontrada");
    if (task.status !== 'rechazada') {
      throw new Error("Solo se pueden reintentar tareas rechazadas");
    }
    return tasksRepository.resetToPending(taskId);
  },
};
