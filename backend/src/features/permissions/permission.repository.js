import { pool } from "../../config/db.js";

export const permissionRepository = {

    async findAll() {
        const result = await pool.query(
            `SELECT
                permission_id,
                permission_name,
                permission_codename,
                permission_module,
                created_at,
                updated_at
             FROM permissions
             ORDER BY permission_module ASC, permission_name ASC`
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT permission_id, permission_name, permission_codename, permission_module
             FROM permissions WHERE permission_id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    },

    async findByCodename(codename) {
        const result = await pool.query(
            `SELECT permission_id FROM permissions WHERE permission_codename = $1`,
            [codename]
        );
        return result.rows[0] ?? null;
    },

    async create(name, codename, module) {
        const result = await pool.query(
            `INSERT INTO permissions (permission_name, permission_codename, permission_module)
             VALUES ($1, $2, $3)
             RETURNING permission_id, permission_name, permission_codename, permission_module`,
            [name, codename, module]
        );
        return result.rows[0];
    },

    async update(id, { name, codename, module }) {
        const result = await pool.query(
            `UPDATE permissions
             SET permission_name    = $2,
                 permission_codename = $3,
                 permission_module  = $4,
                 updated_at         = NOW()
             WHERE permission_id = $1
             RETURNING permission_id, permission_name, permission_codename, permission_module`,
            [id, name, codename, module]
        );
        return result.rows[0] ?? null;
    },
};
