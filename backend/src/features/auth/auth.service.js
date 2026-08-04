// auth.service.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authRepository } from "./auth.repository.js";
import { accessRepository } from "../access/access.repository.js";
import { transporter, MAIL_USER } from "../../config/mailer.js";

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new Error("Credenciales invalidas");
        }

        // ── Cuenta deshabilitada ─────────────────────────────────────────────
        // is_enabled puede ser null en filas previas a la migración; null se trata como habilitado.
        const isEnabled = user.is_enabled ?? true;
        if (!isEnabled) {
            throw new Error("Tu cuenta está deshabilitada. Comunícate con un administrador.");
        }

        // ── Cuenta bloqueada por intentos ────────────────────────────────────
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            const minutos = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
            throw new Error(`Cuenta bloqueada. Intenta de nuevo en ${minutos} minuto(s).`);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            await authRepository.incrementLoginAttempts(email);
            const attempts = (user.login_attempts || 0) + 1;

            if (attempts >= 3) {
                const lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
                await authRepository.lockAccount(email, lockedUntil);
                throw new Error("Cuenta bloqueada por 15 minutos por demasiados intentos fallidos.");
            }

            const restantes = 3 - attempts;
            throw new Error(`Credenciales invalidas. Te quedan ${restantes} intento(s) antes del bloqueo.`);
        }

        // ── Verificar vigencia de la cuenta ANTES de resetear intentos ────────
        // Así un usuario con cuenta expirada no limpia su historial de intentos.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.start_date && new Date(user.start_date) > today) {
            throw new Error("Tu cuenta aún no está activa. Comunícate con un administrador.");
        }

        if (user.end_date && new Date(user.end_date) < today) {
            throw new Error("Tu cuenta ha vencido. Comunícate con un administrador.");
        }

        // Login exitoso — reiniciar intentos solo cuando el acceso es definitivamente válido
        await authRepository.resetLoginAttempts(email);

        // Obtener permisos efectivos (grupo + individuales) para incluirlos en el token
        const permissions = await accessRepository.getUserPermissions(user.user_email);

        const token = jwt.sign(
            {
                email:       user.user_email,
                userGroup:   user.user_group,
                permissions, // codenames: ["create_user", "list_loan", ...]
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            mustChangePassword: user.must_change_password ?? false,
            user: {
                email: user.user_email,
            },
        };
    },

    // ── Cambio de contraseña obligatorio (primer ingreso) ────────────────────

    async changeFirstPassword(email, newPassword) {
        const hashed = await bcrypt.hash(newPassword, 10);
        await authRepository.updatePassword(email, hashed);
        await authRepository.clearMustChangePassword(email);
    },

    // ── Forgot password ──────────────────────────────────────────────────────

    async forgotPassword(email) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new Error("CORREO_NO_REGISTRADO");
        }

        const otp       = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

        await authRepository.saveOtp(email, otp, expiresAt);

        await transporter.sendMail({
            from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
            to:      email,
            subject: "Código de recuperación de contraseña",
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0e123e;border-radius:16px;color:#fff;">
                    <h2 style="color:#50E5F9;margin-top:0;">Recuperar contraseña</h2>
                    <p>Tu código de verificación es:</p>
                    <div style="font-size:2.5rem;font-weight:bold;letter-spacing:12px;color:#fff;background:rgba(255,255,255,0.08);padding:16px 24px;border-radius:10px;text-align:center;margin:24px 0;">
                        ${otp}
                    </div>
                    <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;">
                        Este código expira en <strong style="color:#fff;">10 minutos</strong>.<br/>
                        Si no solicitaste este código, ignora este correo.
                    </p>
                </div>
            `,
        });
    },

    async verifyOtp(email, otpCode) {
        const record = await authRepository.findValidOtp(email, otpCode);
        if (!record) {
            throw new Error("Código inválido o expirado");
        }
        // No marcamos como usado aún — se marca al cambiar la contraseña
        return true;
    },

    async resetPassword(email, otpCode, newPassword) {
        const record = await authRepository.findValidOtp(email, otpCode);
        if (!record) {
            throw new Error("Código inválido o expirado");
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await authRepository.updatePassword(email, hashed);
        await authRepository.markOtpUsed(record.id);
    },
};