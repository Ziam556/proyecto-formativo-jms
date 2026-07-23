//backend/src/features/auth/auth.routes.js
//Rutas de autenticacion 

import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

//POST/api/auth/login
router.post("/login", authController.login)

//POST/api/auth/logout
router.post("/logout", authController.logout)

//POST/api/auth/forgot-password → envía OTP al correo
router.post("/forgot-password", authController.forgotPassword)

//POST/api/auth/verify-otp → valida el código
router.post("/verify-otp", authController.verifyOtp)

//POST/api/auth/reset-password → cambia la contraseña
router.post("/reset-password", authController.resetPassword)

export default router;