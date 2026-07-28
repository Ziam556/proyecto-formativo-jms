import { pool } from "../../config/db.js";

export const accessRepository = {
    /**
     * Devuelve todos los codenames de permiso efectivos para un usuario.
     * Los permisos efectivos = permisos del grupo + permisos individuales directos.
     *
     * Se consultan tres fuentes para cubrir tanto el sistema relacional
     * (user_groups) como el campo de texto legacy (user_group), garantizando
     * que ningún permiso se pierda por inconsistencias de datos.
     */
    async getUserPermissions(userEmail) {
        const result = await pool.query(
            `SELECT DISTINCT p.permission_codename
             FROM permissions p
             WHERE p.permission_id IN (

                 -- 1. Permisos del grupo vía tabla relacional user_groups (sistema actual)
                 SELECT gp.permission_id
                 FROM group_permissions gp
                 INNER JOIN user_groups ug ON ug.group_id = gp.group_id
                 INNER JOIN users u        ON u.user_id   = ug.user_id
                 WHERE u.user_email = $1

                 UNION

                 -- 2. Permisos del grupo vía columna de texto user_group (sistema legacy)
                 SELECT gp.permission_id
                 FROM group_permissions gp
                 INNER JOIN groups g ON g.group_id    = gp.group_id
                 INNER JOIN users u  ON u.user_group  = g.group_name
                 WHERE u.user_email = $1

                 UNION

                 -- 3. Permisos individuales asignados directamente al usuario
                 SELECT up.permission_id
                 FROM user_permissions up
                 INNER JOIN users u ON u.user_id = up.user_id
                 WHERE u.user_email = $1
             )
             ORDER BY p.permission_codename`,
            [userEmail]
        );
        return result.rows.map((row) => row.permission_codename);
    },
};
