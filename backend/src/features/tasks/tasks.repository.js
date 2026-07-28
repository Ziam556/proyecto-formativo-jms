import { pool } from "../../config/db.js";

export const tasksRepository = {

  // ── Crear tarea ──────────────────────────────────────────────
  async create({ taskName, taskDescription, assignedType, assignedUserDoc, assignedGroupId, priority, dueDate, createdBy }) {
    const result = await pool.query(
      `INSERT INTO public.tasks
         (task_name, task_description, assigned_type, assigned_user_doc,
          assigned_group_id, priority, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [taskName, taskDescription, assignedType, assignedUserDoc || null,
       assignedGroupId || null, priority, dueDate || null, createdBy]
    );
    return result.rows[0];
  },

  // ── Listar todas las tareas (admin) ──────────────────────────
  async findAll({ status, search } = {}) {
    let query = `
      SELECT
        t.*,
        u.user_name   AS assigned_user_name,
        g.group_name  AS assigned_group_name
      FROM public.tasks t
      LEFT JOIN public.users  u ON u.user_document_number = t.assigned_user_doc
      LEFT JOIN public.groups g ON g.group_id = t.assigned_group_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'todos') {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (t.task_name ILIKE $${params.length} OR u.user_name ILIKE $${params.length} OR g.group_name ILIKE $${params.length})`;
    }

    query += ` ORDER BY t.created_at DESC`;
    const result = await pool.query(query, params);
    return result.rows;
  },

  // ── Obtener una tarea por ID (con evidencias) ─────────────────
  async findById(taskId) {
    const taskResult = await pool.query(
      `SELECT
         t.*,
         u.user_name   AS assigned_user_name,
         g.group_name  AS assigned_group_name
       FROM public.tasks t
       LEFT JOIN public.users  u ON u.user_document_number = t.assigned_user_doc
       LEFT JOIN public.groups g ON g.group_id = t.assigned_group_id
       WHERE t.task_id = $1`,
      [taskId]
    );
    const task = taskResult.rows[0] ?? null;
    if (!task) return null;

    const evidenceResult = await pool.query(
      `SELECT * FROM public.task_evidence WHERE task_id = $1 ORDER BY uploaded_at ASC`,
      [taskId]
    );
    task.evidence = evidenceResult.rows;
    return task;
  },

  // ── Mis tareas (usuario autenticado) ─────────────────────────
  // Devuelve tareas asignadas al usuario por doc O a alguno de sus grupos
  async findByUserDoc(userDoc) {
    const result = await pool.query(
      `SELECT DISTINCT
         t.*,
         g.group_name AS assigned_group_name
       FROM public.tasks t
       LEFT JOIN public.groups g ON g.group_id = t.assigned_group_id
       LEFT JOIN public.user_groups ug ON ug.group_id = t.assigned_group_id
       LEFT JOIN public.users u ON u.user_id = ug.user_id
       WHERE
         (t.assigned_type = 'user'  AND t.assigned_user_doc = $1)
         OR
         (t.assigned_type = 'group' AND u.user_document_number = $1)
       ORDER BY t.created_at DESC`,
      [userDoc]
    );
    return result.rows;
  },

  // ── Marcar tarea como completada (usuario) ───────────────────
  async markCompleted(taskId, completedByDoc, userComment) {
    const result = await pool.query(
      `UPDATE public.tasks
       SET status = 'por_verificar', completed_at = NOW(),
           completed_by_doc = $2, user_comment = $3, updated_at = NOW()
       WHERE task_id = $1
       RETURNING *`,
      [taskId, completedByDoc, userComment || null]
    );
    return result.rows[0] ?? null;
  },

  // ── Guardar evidencias ────────────────────────────────────────
  async saveEvidence(taskId, files) {
    if (!files.length) return;
    const values = files
      .map((f, i) => `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`)
      .join(", ");
    const params = [taskId];
    files.forEach((f) => params.push(f.file_path, f.file_name, f.file_type));
    await pool.query(
      `INSERT INTO public.task_evidence (task_id, file_path, file_name, file_type) VALUES ${values}`,
      params
    );
  },

  // ── Verificar tarea (admin): aprobar o rechazar ───────────────
  async verify(taskId, { action, adminComment, verifiedBy }) {
    const newStatus = action === 'aprobar' ? 'completada' : 'rechazada';
    const result = await pool.query(
      `UPDATE public.tasks
       SET status = $2, admin_comment = $3, verified_by = $4, verified_at = NOW(), updated_at = NOW()
       WHERE task_id = $1
       RETURNING *`,
      [taskId, newStatus, adminComment || null, verifiedBy]
    );
    return result.rows[0] ?? null;
  },

  // ── Rechazada → volver a pendiente (usuario) ──────────────────
  async resetToPending(taskId) {
    const result = await pool.query(
      `UPDATE public.tasks
       SET status = 'pendiente', completed_at = NULL, completed_by_doc = NULL,
           admin_comment = NULL, verified_by = NULL, verified_at = NULL, updated_at = NOW()
       WHERE task_id = $1
       RETURNING *`,
      [taskId]
    );
    return result.rows[0] ?? null;
  },

  // ── Eliminar evidencias anteriores de una tarea ───────────────
  async clearEvidence(taskId) {
    await pool.query(`DELETE FROM public.task_evidence WHERE task_id = $1`, [taskId]);
  },

  async delete(taskId) {
    const result = await pool.query(
      `DELETE FROM public.tasks WHERE task_id = $1 RETURNING task_id, task_name`,
      [taskId]
    );
    return result.rows[0] ?? null;
  },

  // ── Obtener doc del usuario por email ────────────────────────
  async getDocByEmail(email) {
    const result = await pool.query(
      `SELECT user_document_number FROM public.users WHERE user_email = $1`,
      [email]
    );
    return result.rows[0]?.user_document_number ?? null;
  },

  // ── Obtener group_id por nombre ───────────────────────────────
  async getGroupIdByName(groupName) {
    const result = await pool.query(
      `SELECT group_id FROM public.groups WHERE group_name = $1`,
      [groupName]
    );
    return result.rows[0]?.group_id ?? null;
  },
};
