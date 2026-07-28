// auth.repository.js
import { pool } from "../../config/db.js";

export const authRepository = {
    async findByEmail(userEmail) {
        const query = `
            SELECT user_email, user_password AS password,
                   user_group, start_date, end_date,
                   enabled AS is_enabled, login_attempts, locked_until
            FROM public.users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    },

    async incrementLoginAttempts(userEmail) {
        await pool.query(
            `UPDATE public.users
             SET login_attempts = login_attempts + 1
             WHERE user_email = $1`,
            [userEmail]
        );
    },

    async lockAccount(userEmail, lockedUntil) {
        await pool.query(
            `UPDATE public.users
             SET locked_until = $2, login_attempts = 0
             WHERE user_email = $1`,
            [userEmail, lockedUntil]
        );
    },

    async resetLoginAttempts(userEmail) {
        await pool.query(
            `UPDATE public.users
             SET login_attempts = 0, locked_until = NULL
             WHERE user_email = $1`,
            [userEmail]
        );
    },

    // ── Forgot password ──────────────────────────────────────────────────────

    async saveOtp(userEmail, otpCode, expiresAt) {
        await pool.query(
            `UPDATE public.password_reset_tokens SET used = TRUE WHERE user_email = $1`,
            [userEmail]
        );
        const result = await pool.query(
            `INSERT INTO public.password_reset_tokens (user_email, otp_code, expires_at)
             VALUES ($1, $2, $3) RETURNING id`,
            [userEmail, otpCode, expiresAt]
        );
        return result.rows[0];
    },

    async findValidOtp(userEmail, otpCode) {
        const result = await pool.query(
            `SELECT * FROM public.password_reset_tokens
             WHERE user_email = $1
               AND otp_code   = $2
               AND used       = FALSE
               AND expires_at > NOW()
             ORDER BY created_at DESC
             LIMIT 1`,
            [userEmail, otpCode]
        );
        return result.rows[0];
    },

    async markOtpUsed(id) {
        await pool.query(
            `UPDATE public.password_reset_tokens SET used = TRUE WHERE id = $1`,
            [id]
        );
    },

    async updatePassword(userEmail, hashedPassword) {
        await pool.query(
            `UPDATE public.users SET user_password = $1 WHERE user_email = $2`,
            [hashedPassword, userEmail]
        );
    },
}