import { notificationsRepository } from "./notifications.repository.js";

export const notificationsService = {

  // ── Tarea creada → notificar al asignado ──────────────────────
  async onTaskCreated(task) {
    const { task_id, task_name, assigned_type, assigned_user_doc, assigned_group_id } = task;

    if (assigned_type === "user" && assigned_user_doc) {
      const email = await notificationsRepository.getEmailByDoc(assigned_user_doc);
      if (email) {
        await notificationsRepository.create({
          recipientEmail: email,
          title:   "Nueva tarea asignada",
          message: `Se te asignó la tarea: "${task_name}"`,
          taskId:  task_id,
        });
      }
    } else if (assigned_type === "group" && assigned_group_id) {
      const emails = await notificationsRepository.getGroupMemberEmails(assigned_group_id);
      await notificationsRepository.createMany(
        emails.map((email) => ({
          recipientEmail: email,
          title:   "Nueva tarea para tu grupo",
          message: `Tu grupo recibió una nueva tarea: "${task_name}"`,
          taskId:  task_id,
        }))
      );
    }
  },

  // ── Tarea completada → notificar al creador (admin) ───────────
  async onTaskCompleted(task) {
    if (!task.created_by) return;
    await notificationsRepository.create({
      recipientEmail: task.created_by,
      title:   "Tarea lista para verificar",
      message: `La tarea "${task.task_name}" fue marcada como realizada y espera tu verificación.`,
      taskId:  task.task_id,
    });
  },

  // ── Tarea verificada → notificar al usuario que la completó ──
  async onTaskVerified(task) {
    if (!task.completed_by_doc) return;
    const email = await notificationsRepository.getEmailByDoc(task.completed_by_doc);
    if (!email) return;

    const approved = task.status === "completada";
    await notificationsRepository.create({
      recipientEmail: email,
      title:   approved ? "Tarea aprobada ✅" : "Tarea requiere correcciones",
      message: approved
        ? `Tu tarea "${task.task_name}" fue aprobada.`
        : `Tu tarea "${task.task_name}" fue rechazada.${task.admin_comment ? ` Comentario: ${task.admin_comment}` : " Revisa los comentarios."}`,
      taskId:  task.task_id,
    });
  },

  // ── Consultas del usuario autenticado ────────────────────────
  async getMyNotifications(email) {
    return notificationsRepository.findByEmail(email);
  },

  async getUnreadCount(email) {
    return notificationsRepository.countUnread(email);
  },

  async markRead(notificationId, email) {
    return notificationsRepository.markRead(notificationId, email);
  },

  async markAllRead(email) {
    return notificationsRepository.markAllRead(email);
  },
};
