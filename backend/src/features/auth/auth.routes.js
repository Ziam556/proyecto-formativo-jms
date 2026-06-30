//backend/src/features/auth/auth.routes.js
//Rutas de autenticacion 

import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

//POST/api/auth/login
router.post("/login", authController.login)

//POST/api/auth/logout
router.post("/logout", authController.logout)

export default router;