// auth.repository.js
import { pool } from "../../config/db.js";

export const authRepository = {
    async findByEmail(userEmail) {
        const query = `
            SELECT user_email, user_password AS password,
                   start_date, end_date
            FROM public.users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    }
}