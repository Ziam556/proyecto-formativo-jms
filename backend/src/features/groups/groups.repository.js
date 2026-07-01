import { pool } from "../../config/db.js";

export const groupsRepository = {
    async getAll() {
        const result = await pool.query(
            `SELECT group_id, group_name FROM groups ORDER BY group_name`
        );
        return result.rows;
    },

    async getAllPermissions() {
        const result = await pool.query(
            `SELECT permission_id, permission_name, permission_codename, permission_module
             FROM permissions
             ORDER BY permission_module ASC, permission_name ASC`
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

    async update(groupId, groupName) {
        const result = await pool.query(
            `UPDATE groups SET group_name = $1, updated_at = NOW() WHERE group_id = $2 RETURNING *`,
            [groupName, groupId]
        );
        return result.rows[0] ?? null;
    },

    async getUserIdsByDocuments(documentNumbers) {
        if (!documentNumbers.length) return [];
        const result = await pool.query(
            `SELECT user_id FROM users WHERE user_document_number = ANY($1)`,
            [documentNumbers]
        );
        return result.rows.map((r) => r.user_id);
    },

    async addUsersToGroup(groupId, userIds) {
        if (!userIds.length) return;
        const values = userIds.map((uid) => `(${uid}, ${groupId})`).join(", ");
        await pool.query(
            `INSERT INTO user_groups (user_id, group_id) VALUES ${values} ON CONFLICT DO NOTHING`
        );
    },

    async replacePermissions(groupId, permissionIds) {
        await pool.query(`DELETE FROM group_permissions WHERE group_id = $1`, [groupId]);
        if (!permissionIds.length) return;
        const values = permissionIds.map((pid) => `(${groupId}, ${pid})`).join(", ");
        await pool.query(
            `INSERT INTO group_permissions (group_id, permission_id) VALUES ${values} ON CONFLICT DO NOTHING`
        );
    },

    async getUsersByGroupId(groupId) {
        const result = await pool.query(
            `SELECT u.user_id, u.user_name, u.user_document_number
             FROM user_groups ug
             INNER JOIN users u ON u.user_id = ug.user_id
             WHERE ug.group_id = $1
             ORDER BY u.user_name`,
            [groupId]
        );
        return result.rows;
    },

    async removeUsersFromGroup(groupId, userIds) {
        if (!userIds.length) return;
        await pool.query(
            `DELETE FROM user_groups WHERE group_id = $1 AND user_id = ANY($2)`,
            [groupId, userIds]
        );
    },
};
