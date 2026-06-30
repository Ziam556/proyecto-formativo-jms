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
    }
}