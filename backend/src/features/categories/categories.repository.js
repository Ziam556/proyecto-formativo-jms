import { pool } from "../../config/db.js";

export const categoriesRepository = {

    async findAll() {
        const result = await pool.query(
            `SELECT * FROM public.categories ORDER BY name ASC`
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT * FROM public.categories WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    },

    async create({ name, prefix }) {
        const result = await pool.query(
            `INSERT INTO public.categories (name, prefix)
             VALUES ($1, $2)
             RETURNING *`,
            [name, prefix ?? ""]
        );
        return result.rows[0];
    },

    async update(id, { name, prefix }) {
        const result = await pool.query(
            `UPDATE public.categories
             SET name   = COALESCE($1, name),
                 prefix = COALESCE($2, prefix)
             WHERE id = $3
             RETURNING *`,
            [name ?? null, prefix ?? null, id]
        );
        return result.rows[0] ?? null;
    },

    async toggleEnabled(id, enabled) {
        const result = await pool.query(
            `UPDATE public.categories
             SET enabled = $1
             WHERE id = $2
             RETURNING *`,
            [enabled, id]
        );
        return result.rows[0] ?? null;
    },

    async remove(id) {
        const result = await pool.query(
            `DELETE FROM public.categories WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] ?? null;
    },
};
