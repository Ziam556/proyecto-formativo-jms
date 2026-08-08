//backend/src/features/auth/auth.controller.js
//endpoint login 

import { authService } from "./auth.service.js";

export const authController = {
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login exitoso",
                ...result,
            })
        } catch (err) {
            res.status(401).json({
                error: err.message,
            });
        }
    },

    async logout(req, res) {
        // Con JWT stateless el token expira por sí solo.
        // Este endpoint confirma al cliente que puede limpiar su sesión.
        res.status(200).json({ message: "Sesión cerrada exitosamente" });
    },

    // ── Forgot password ──────────────────────────────────────────────────────

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: "El correo es requerido" });

            await authService.forgotPassword(email);
            res.status(200).json({ message: "Código enviado correctamente." });
        } catch (err) {
            if (err.message === "CORREO_NO_REGISTRADO") {
                return res.status(404).json({ error: "El correo ingresado no está registrado en el sistema." });
            }
            res.status(500).json({ error: "Error al enviar el correo. Intenta más tarde." });
        }
    },

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) return res.status(400).json({ error: "Correo y código son requeridos" });

            await authService.verifyOtp(email, otp);
            res.status(200).json({ message: "Código válido" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword)
                return res.status(400).json({ error: "Todos los campos son requeridos" });

            await authService.resetPassword(email, otp, newPassword);
            res.status(200).json({ message: "Contraseña actualizada exitosamente" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // ── Cambio de contraseña obligatorio (primer ingreso) ────────────────────

    async changeFirstPassword(req, res) {
        try {
            const { newPassword } = req.body;
            if (!newPassword)
                return res.status(400).json({ error: "La nueva contraseña es requerida" });

            const email = req.user.email; // viene del middleware authenticateToken
            const { token } = await authService.changeFirstPassword(email, newPassword);
            res.status(200).json({ message: "Contraseña actualizada. Ya puedes continuar.", token });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
}