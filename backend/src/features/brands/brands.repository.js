import { pool } from "../../config/db.js";

export const brandsRepository = {

    // Obtener todas las marcas
    async findAll() {
        const result = await pool.query(
            `SELECT * FROM public.brands ORDER BY name ASC`
        );
        return result.rows;
    },

    // Obtener una marca por ID
    async findById(id) {
        const result = await pool.query(
            `SELECT * FROM public.brands WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    },

    // Crear una marca
    async create({ name }) {
        const result = await pool.query(
            `INSERT INTO public.brands (name)
             VALUES ($1)
             RETURNING *`,
            [name]
        );
        return result.rows[0];
    },

    // Actualizar nombre de una marca
    async update(id, { name }) {
        const result = await pool.query(
            `UPDATE public.brands
             SET name = $1
             WHERE id = $2
             RETURNING *`,
            [name, id]
        );
        return result.rows[0] ?? null;
    },

    // Cambiar estado enabled de una marca
    async toggleEnabled(id, enabled) {
        const result = await pool.query(
            `UPDATE public.brands
             SET enabled = $1
             WHERE id = $2
             RETURNING *`,
            [enabled, id]
        );
        return result.rows[0] ?? null;
    },

    // Eliminar una marca
    async remove(id) {
        const result = await pool.query(
            `DELETE FROM public.brands WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] ?? null;
    },
};
