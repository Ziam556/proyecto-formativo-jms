import { pool } from "../../config/db.js";

export const notificationsRepository = {

  // ── Crear una notificación ────────────────────────────────────
  async create({ recipientEmail, title, message, taskId }) {
    await pool.query(
      `INSERT INTO public.notifications (recipient_email, title, message, task_id)
       VALUES ($1, $2, $3, $4)`,
      [recipientEmail, title, message || null, taskId || null]
    );
  },

  // ── Crear varias notificaciones ───────────────────────────────
  async createMany(notifications) {
    for (const n of notifications) {
      await this.create(n);
    }
  },

  // ── Notificaciones del usuario (últimas 50) ───────────────────
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM public.notifications
       WHERE recipient_email = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [email]
    );
    return result.rows;
  },

  // ── Conteo de no leídas ───────────────────────────────────────
  async countUnread(email) {
    const result = await pool.query(
      `SELECT COUNT(*) FROM public.notifications
       WHERE recipient_email = $1 AND is_read = FALSE`,
      [email]
    );
    return Number(result.rows[0].count);
  },

  // ── Marcar una como leída ─────────────────────────────────────
  async markRead(notificationId, email) {
    await pool.query(
      `UPDATE public.notifications SET is_read = TRUE
       WHERE notification_id = $1 AND recipient_email = $2`,
      [notificationId, email]
    );
  },

  // ── Marcar todas como leídas ──────────────────────────────────
  async markAllRead(email) {
    await pool.query(
      `UPDATE public.notifications SET is_read = TRUE
       WHERE recipient_email = $1 AND is_read = FALSE`,
      [email]
    );
  },

  // ── Email de un usuario por doc ───────────────────────────────
  async getEmailByDoc(doc) {
    const result = await pool.query(
      `SELECT user_email FROM public.users WHERE user_document_number = $1`,
      [doc]
    );
    return result.rows[0]?.user_email ?? null;
  },

  // ── Emails de todos los miembros de un grupo ──────────────────
  async getGroupMemberEmails(groupId) {
    const result = await pool.query(
      `SELECT u.user_email
       FROM public.users u
       JOIN public.user_groups ug ON ug.user_id = u.user_id
       WHERE ug.group_id = $1 AND u.user_email IS NOT NULL`,
      [groupId]
    );
    return result.rows.map((r) => r.user_email);
  },
};
