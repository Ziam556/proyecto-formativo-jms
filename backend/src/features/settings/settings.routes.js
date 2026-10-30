import { Router } from "express";
import { settingsController } from "./settings.controller.js";
import { authenticateToken, requireSuperAdmin } from "../../middlewares/auth.middlewares.js";

const router = Router();

// GET /api/settings/contact-email  — público (Login y menú lo necesitan sin token)
router.get("/contact-email", settingsController.getContactEmail);

// PUT /api/settings/contact-email  — solo SuperAdministrador
router.put(
    "/contact-email",
    authenticateToken,
    requireSuperAdmin,
    settingsController.updateContactEmail
);

export default router;
