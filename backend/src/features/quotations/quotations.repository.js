import { pool } from "../../config/db.js";

function parsePaths(raw) {
    try { return JSON.parse(raw) || []; }
    catch { return []; }
}

export const quotationsRepository = {

    // ── Todas las cotizaciones (consumo + devolutivo) ─────────────────────────
    async findAll() {
        const result = await pool.query(`
            SELECT
                r.returnable_material_id::text AS material_id,
                r.material_element_name         AS material_name,
                r.material_category             AS category,
                r.material_quotations,
                'returnable'                    AS material_type
            FROM public.returnable_material r
            WHERE r.material_quotations IS NOT NULL
              AND r.material_quotations <> '[]'
              AND r.material_quotations <> 'null'

            UNION ALL

            SELECT
                c.consumable_material_id::text  AS material_id,
                c.material_element_name         AS material_name,
                c.material_category             AS category,
                c.material_quotations,
                'consumable'                    AS material_type
            FROM public.consumable_material c
            WHERE c.material_quotations IS NOT NULL
              AND c.material_quotations <> '[]'
              AND c.material_quotations <> 'null'

            ORDER BY material_name ASC
        `);

        const quotations = [];
        for (const row of result.rows) {
            const paths = parsePaths(row.material_quotations);
            paths.forEach((filePath, idx) => {
                quotations.push({
                    id:           `${row.material_type}-${row.material_id}-${idx}`,
                    filePath,
                    fileName:     filePath.split("/").pop(),
                    materialType: row.material_type,
                    materialId:   row.material_id,
                    materialName: row.material_name,
                    category:     row.category,
                });
            });
        }
        return quotations;
    },

    // ── Agregar cotización a devolutivo ───────────────────────────────────────
    async addToReturnable(materialId, filePath) {
        const { rows } = await pool.query(
            `SELECT material_quotations FROM public.returnable_material WHERE returnable_material_id = $1`,
            [materialId]
        );
        const existing = parsePaths(rows[0]?.material_quotations);
        await pool.query(
            `UPDATE public.returnable_material SET material_quotations = $1 WHERE returnable_material_id = $2`,
            [JSON.stringify([...existing, filePath]), materialId]
        );
    },

    // ── Agregar cotización a consumible ───────────────────────────────────────
    async addToConsumable(materialId, filePath) {
        const { rows } = await pool.query(
            `SELECT material_quotations FROM public.consumable_material WHERE consumable_material_id = $1`,
            [materialId]
        );
        const existing = parsePaths(rows[0]?.material_quotations);
        await pool.query(
            `UPDATE public.consumable_material SET material_quotations = $1 WHERE consumable_material_id = $2`,
            [JSON.stringify([...existing, filePath]), materialId]
        );
    },

    // ── Eliminar cotización de devolutivo ─────────────────────────────────────
    async removeFromReturnable(materialId, filePath) {
        const { rows } = await pool.query(
            `SELECT material_quotations FROM public.returnable_material WHERE returnable_material_id = $1`,
            [materialId]
        );
        const remaining = parsePaths(rows[0]?.material_quotations).filter(p => p !== filePath);
        await pool.query(
            `UPDATE public.returnable_material SET material_quotations = $1 WHERE returnable_material_id = $2`,
            [remaining.length ? JSON.stringify(remaining) : null, materialId]
        );
    },

    // ── Eliminar cotización de consumible ─────────────────────────────────────
    async removeFromConsumable(materialId, filePath) {
        const { rows } = await pool.query(
            `SELECT material_quotations FROM public.consumable_material WHERE consumable_material_id = $1`,
            [materialId]
        );
        const remaining = parsePaths(rows[0]?.material_quotations).filter(p => p !== filePath);
        await pool.query(
            `UPDATE public.consumable_material SET material_quotations = $1 WHERE consumable_material_id = $2`,
            [remaining.length ? JSON.stringify(remaining) : null, materialId]
        );
    },
};
