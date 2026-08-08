import { pool } from "../../config/db.js";

export const inventoriesRepository = {

    async findAll() {
        const result = await pool.query(
            `SELECT * FROM public.inventories ORDER BY name ASC`
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT * FROM public.inventories WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    },

    async create({ name }) {
        const result = await pool.query(
            `INSERT INTO public.inventories (name)
             VALUES ($1)
             RETURNING *`,
            [name]
        );
        return result.rows[0];
    },

    async update(id, { name }) {
        const result = await pool.query(
            `UPDATE public.inventories
             SET name = $1
             WHERE id = $2
             RETURNING *`,
            [name, id]
        );
        return result.rows[0] ?? null;
    },

    async toggleEnabled(id, enabled) {
        const result = await pool.query(
            `UPDATE public.inventories
             SET enabled = $1
             WHERE id = $2
             RETURNING *`,
            [enabled, id]
        );
        return result.rows[0] ?? null;
    },

    async remove(id) {
        const result = await pool.query(
            `DELETE FROM public.inventories WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] ?? null;
    },
};
