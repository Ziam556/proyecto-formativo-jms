import { pool } from "../../config/db.js";

export const accessRepository = {
    async getUserPermissions(userEmail) {
        const query = `
            SELECT DISTINCT p.permission_codename
            FROM permissions p
            INNER JOIN group_permissions gp ON gp.permission_id = p.permission_id
            INNER JOIN groups g ON g.group_id = gp.group_id
            INNER JOIN users u ON u.user_group = g.group_name
            WHERE u.user_email = $1;
        `;
        const result = await pool.query(query, [userEmail]);
        return result.rows.map((row) => row.permission_codename);
    },
};
