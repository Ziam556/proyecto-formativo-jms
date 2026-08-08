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
        user_document_type,
        user_document_number,
        user_address,
        user_password,
        start_date,
        end_date,
        user_group,
        user_image,
        must_change_password
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING user_id, user_email;
    `;

    const values = [
      userName,               // $1
      userEmail,              // $2
      userEmailVerification,  // $3
      userEmailInstitutional, // $4
      userDocumentType,       // $5
      userDocumentNumber,     // $6
      userAddress,            // $7
      userPassword,           // $8
      startDate,              // $9
      endDate,                // $10
      userGroup,              // $11
      userImage,              // $12
      true,                   // $13  must_change_password — siempre true al crear
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.user_name,
         u.user_email,
         u.user_email_verification,
         u.user_email_institutional,
         u.user_document_type,
         u.user_document_number,
         u.user_address,
         u.user_group,
         u.user_image,
         u.start_date,
         u.end_date,
         COALESCE(
           json_agg(
             json_build_object('phone_number', up.phone_number, 'is_primary', up.is_primary)
           ) FILTER (WHERE up.phone_number IS NOT NULL),
           '[]'::json
         ) AS phones
       FROM public.users u
       LEFT JOIN public.user_phones up ON up.user_id = u.user_id
       WHERE u.user_email = $1
       GROUP BY u.user_id`,
      [email]
    );
    return result.rows[0] ?? null;
  },

  async findAll() {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.user_name,
         u.user_email,
         u.user_email_institutional,
         u.user_document_type,
         u.user_document_number,
         u.user_address,
         u.user_group,
         u.user_image,
         u.start_date,
         u.end_date,
         u.enabled,
         COALESCE(
           json_agg(
             json_build_object('phone_number', up.phone_number, 'is_primary', up.is_primary)
           ) FILTER (WHERE up.phone_number IS NOT NULL),
           '[]'::json
         ) AS phones
       FROM public.users u
       LEFT JOIN public.user_phones up ON up.user_id = u.user_id
       GROUP BY u.user_id
       ORDER BY u.user_name ASC`
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

    const sets = [
      "user_name                = $2",
      "user_email               = $3",
      "user_email_verification  = $4",
      "user_email_institutional = $5",
      "user_document_type       = $6",
      "user_document_number     = $7",
      "user_address             = $8",
      "start_date               = $9",
      "end_date                 = $10",
      "user_group               = $11",
      "enabled                  = $12",
    ];

    const values = [
      documentNumber,                 // $1 WHERE
      userName,                       // $2
      userEmail,                      // $3
      userEmailVerification,          // $4
      userEmailInstitutional || null, // $5
      userDocumentType,               // $6
      userDocumentNumber,             // $7
      userAddress,                    // $8
      startDate,                      // $9
      endDate,                        // $10
      userGroup || null,              // $11
      isEnabled ?? true,              // $12
    ];

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

  // ── Sincroniza los teléfonos de un usuario (DELETE + INSERT) ────────────
  async syncPhones(userId, phones) {
    await pool.query(`DELETE FROM public.user_phones WHERE user_id = $1`, [userId]);
    for (const phone of phones) {
      if (!phone.phoneNumber || phone.phoneNumber.trim() === "") continue;
      await pool.query(
        `INSERT INTO public.user_phones (user_id, phone_number, is_primary)
         VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [userId, phone.phoneNumber.trim(), phone.isPrimary ?? false]
      );
    }
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
