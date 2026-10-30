import { pool } from "../../config/db.js";

export const settingsRepository = {
    async get(key) {
        const result = await pool.query(
            `SELECT value FROM public.system_settings WHERE key = $1`,
            [key]
        );
        return result.rows[0]?.value ?? null;
    },

    async set(key, value) {
        const result = await pool.query(
            `INSERT INTO public.system_settings (key, value)
             VALUES ($1, $2)
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
             RETURNING key, value`,
            [key, value]
        );
        return result.rows[0];
    },
};
