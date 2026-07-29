import { pool } from "../../config/db.js";

export const userRepository = {

  async create(userData) {

    const {
      userName,
      userEmail,
      userEmailVerification,
      userEmailInstitutional,
      userPhone,
      userSecondaryPhone,
      userDocumentType,
      userDocumentNumber,
      userAddress,
      userPassword,
      startDate,
      endDate,
      userGroup,
      userImage,
    } = userData;

    const query = `
      INSERT INTO public.users (
        user_name,
        user_email,
        user_email_verification,
        user_email_institutional,
        user_phone,
        user_secondary_phone,
        user_document_type,
        user_document_number,
        user_address,
        user_password,
        start_date,
        end_date,
        user_group,
        user_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING user_id, user_email;
    `;

    const values = [
      userName,               // $1
      userEmail,              // $2
      userEmailVerification,  // $3
      userEmailInstitutional, // $4
      userPhone,              // $5
      userSecondaryPhone,     // $6
      userDocumentType,       // $7
      userDocumentNumber,     // $8
      userAddress,            // $9
      userPassword,           // $10
      startDate,              // $11
      endDate,                // $12
      userGroup,              // $13
      userImage,              // $14
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT
         user_name,
         user_email,
         user_email_verification,
         user_email_institutional,
         user_phone,
         user_secondary_phone,
         user_document_type,
         user_document_number,
         user_address,
         user_group,
         user_image,
         start_date,
         end_date
       FROM public.users
       WHERE user_email = $1`,
      [email]
    );
    return result.rows[0] ?? null;
  },

  async findAll() {
    const result = await pool.query(
      `SELECT
         user_name,
         user_email,
         user_email_institutional,
         user_phone,
         user_secondary_phone,
         user_document_type,
         user_document_number,
         user_address,
         user_group,
         user_image,
         start_date,
         end_date,
         enabled
       FROM public.users
       ORDER BY user_name ASC`
    );
    return result.rows;
  },

  async findUserIdByDocument(documentNumber) {
    const result = await pool.query(
      `SELECT user_id FROM public.users WHERE user_document_number = $1`,
      [documentNumber]
    );
    return result.rows[0]?.user_id ?? null;
  },

  async getPermissionsByUserId(userId) {
    const result = await pool.query(
      `SELECT p.permission_codename
       FROM user_permissions up
       INNER JOIN permissions p ON p.permission_id = up.permission_id
       WHERE up.user_id = $1`,
      [userId]
    );
    return result.rows.map((r) => r.permission_codename);
  },

  async assignPermissions(userId, permissionIds) {
    if (!permissionIds.length) return;
    await pool.query(
      `DELETE FROM user_permissions WHERE user_id = $1`,
      [userId]
    );
    const values = permissionIds.map((pid) => `(${userId}, ${pid})`).join(", ");
    await pool.query(
      `INSERT INTO user_permissions (user_id, permission_id) VALUES ${values} ON CONFLICT DO NOTHING`
    );
  },

  async clearUserPermissions(userId) {
    await pool.query(`DELETE FROM user_permissions WHERE user_id = $1`, [userId]);
  },

  async assignGroupPermissionsToUser(userId, groupName) {
    // Obtener los permission_id del grupo por nombre
    const result = await pool.query(
      `SELECT gp.permission_id
       FROM group_permissions gp
       INNER JOIN groups g ON g.group_id = gp.group_id
       WHERE g.group_name = $1`,
      [groupName]
    );
    const permissionIds = result.rows.map((r) => r.permission_id);
    if (!permissionIds.length) return;

    // UPSERT: agrega los permisos del grupo sin borrar los individuales que el usuario
    // pueda tener asignados de forma explícita. ON CONFLICT DO NOTHING evita duplicados.
    const values = permissionIds.map((pid) => `(${userId}, ${pid})`).join(", ");
    await pool.query(
      `INSERT INTO user_permissions (user_id, permission_id) VALUES ${values} ON CONFLICT DO NOTHING`
    );
  },

  async assignGroup(userId, groupName) {
    // Siempre eliminar la asignación previa
    await pool.query(
      `DELETE FROM user_groups WHERE user_id = $1`,
      [userId]
    );
    if (!groupName) return; // sin grupo → solo limpiar

    const groupResult = await pool.query(
      `SELECT group_id FROM groups WHERE group_name = $1`,
      [groupName]
    );
    const groupId = groupResult.rows[0]?.group_id;
    if (!groupId) return; // nombre de grupo no encontrado

    await pool.query(
      `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, groupId]
    );
  },

  async getPermissionIdsByCodenames(codenames) {
    if (!codenames.length) return [];
    const result = await pool.query(
      `SELECT permission_id FROM permissions WHERE permission_codename = ANY($1)`,
      [codenames]
    );
    return result.rows.map((r) => r.permission_id);
  },

  async delete(documentNumber) {
    const result = await pool.query(
      `DELETE FROM public.users WHERE user_document_number = $1 RETURNING user_document_number, user_name`,
      [documentNumber]
    );
    return result.rows[0] ?? null;
  },

  async update(documentNumber, data) {
    const {
      userName,
      userEmail,
      userEmailVerification,
      userEmailInstitutional,
      userPhone,
      userSecondaryPhone,
      userDocumentType,
      userDocumentNumber,
      userAddress,
      userPassword,   // ya hasheada o null si no cambió
      startDate,
      endDate,
      userGroup,
      userImage,
      isEnabled,
    } = data;

    // Construimos el SET dinámicamente para no pisar campos no enviados
    const sets = [
      "user_name               = $2",
      "user_email              = $3",
      "user_email_verification = $4",
      "user_email_institutional= $5",
      "user_phone              = $6",
      "user_secondary_phone    = $7",
      "user_document_type      = $8",
      "user_document_number    = $9",
      "user_address            = $10",
      "start_date              = $11",
      "end_date                = $12",
      "user_group              = $13",
      "enabled                 = $14",
    ];

    const values = [
      documentNumber,        // $1 WHERE
      userName,              // $2
      userEmail,             // $3
      userEmailVerification, // $4
      userEmailInstitutional || null, // $5
      userPhone,             // $6
      userSecondaryPhone || null,     // $7
      userDocumentType,      // $8
      userDocumentNumber,    // $9
      userAddress,           // $10
      startDate,             // $11
      endDate,               // $12
      userGroup || null,     // $13
      isEnabled ?? true,     // $14
    ];

    // Password y imagen solo se actualizan si vienen
    if (userPassword) {
      sets.push(`user_password = $${values.length + 1}`);
      values.push(userPassword);
    }
    if (userImage) {
      sets.push(`user_image = $${values.length + 1}`);
      values.push(userImage);
    }

    const query = `
      UPDATE public.users
      SET ${sets.join(", ")}
      WHERE user_document_number = $1
      RETURNING user_document_number;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
  },

  async toggleUser(id) {
    const result = await pool.query(
      `UPDATE public.users
       SET enabled = NOT enabled
       WHERE user_document_number = $1
       RETURNING user_document_number AS id, enabled`,
      [id]
    );
    return result.rows[0] ?? null;
  },

};
