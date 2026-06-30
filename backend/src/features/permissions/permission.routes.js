import { Router } from "express";
import { permissionController } from "./permission.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

// GET /api/permissions → listar todos
router.get("/", authenticateToken, permissionController.getAll);

// POST /api/permissions → crear permiso
router.post("/", authenticateToken, permissionController.create);

// PUT /api/permissions/:id → actualizar permiso
router.put("/:id", authenticateToken, permissionController.update);

export default router;
