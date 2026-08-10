import { pool } from "../../config/db.js";

export const quotationsRepository = {

    // ── Todas las cotizaciones con metadatos ─────────────────────────────────
    async findAll() {
        const result = await pool.query(`
            SELECT
                q.quotation_id,
                q.file_path,
                q.file_name,
                q.uploaded_by_email,
                q.uploaded_at,
                CASE
                    WHEN q.returnable_material_id IS NOT NULL THEN 'returnable'
                    ELSE 'consumable'
                END AS material_type,
                COALESCE(q.returnable_material_id, q.consumable_material_id) AS material_id,
                COALESCE(r.material_element_name, c.material_element_name)   AS material_name,
                COALESCE(r.material_category,     c.material_category)       AS category
            FROM public.quotations q
            LEFT JOIN public.returnable_material r
                   ON r.returnable_material_id = q.returnable_material_id
            LEFT JOIN public.consumable_material c
                   ON c.consumable_material_id = q.consumable_material_id
            ORDER BY q.uploaded_at DESC
        `);
        return result.rows;
    },

    // ── Insertar una cotización ───────────────────────────────────────────────
    async add({ materialType, materialId, filePath, fileName, uploadedByEmail }) {
        const col = materialType === "returnable"
            ? "returnable_material_id"
            : "consumable_material_id";

        const result = await pool.query(
            `INSERT INTO public.quotations (${col}, file_path, file_name, uploaded_by_email)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [materialId, filePath, fileName, uploadedByEmail ?? null]
        );
        return result.rows[0];
    },

    // ── Eliminar por ID, devuelve file_path para borrar el archivo ───────────
    async removeById(quotationId) {
        const result = await pool.query(
            `DELETE FROM public.quotations WHERE quotation_id = $1 RETURNING file_path`,
            [quotationId]
        );
        return result.rows[0] ?? null;
    },
};
