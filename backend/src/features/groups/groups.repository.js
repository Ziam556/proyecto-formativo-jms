import { pool } from "../../config/db.js";

export const groupsRepository = {
    async getAll() {
        const result = await pool.query(
            `SELECT group_id, group_name FROM groups ORDER BY group_name`
        );
        return result.rows;
    },

    async getPermissionsByGroupId(groupId) {
        const query = `
            SELECT p.permission_id, p.permission_name, p.permission_codename
            FROM group_permissions gp
            INNER JOIN permissions p ON p.permission_id = gp.permission_id
            WHERE gp.group_id = $1
            ORDER BY p.permission_name;
        `;
        const result = await pool.query(query, [groupId]);
        return result.rows;
    },

    async create(groupName) {
        const result = await pool.query(
            `INSERT INTO groups (group_name) VALUES ($1) RETURNING *`,
            [groupName]
        );
        return result.rows[0];
    },

    async assignPermissions(groupId, permissionIds) {
        if (!permissionIds.length) return;
        const values = permissionIds.map((pid) => `(${groupId}, ${pid})`).join(", ");
        await pool.query(
            `INSERT INTO group_permissions (group_id, permission_id) VALUES ${values} ON CONFLICT DO NOTHING`
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
};
