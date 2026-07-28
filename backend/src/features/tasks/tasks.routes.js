import { Router } from "express";
import { tasksController } from "./tasks.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";
import { uploadTaskEvidence } from "../../config/upload.js";

const router = Router();

// Todas las rutas requieren token
router.use(authenticateToken);

// GET  /api/tasks/my-tasks  → tareas del usuario autenticado
router.get("/my-tasks", tasksController.getMyTasks);

// GET  /api/tasks            → listar todas (admin)
router.get("/", tasksController.getAll);

// GET  /api/tasks/:id        → detalle de una tarea
router.get("/:id", tasksController.getById);

// POST /api/tasks            → crear tarea (admin)
router.post("/", tasksController.create);

// PUT  /api/tasks/:id/complete → usuario marca como hecha + evidencias
router.put("/:id/complete", uploadTaskEvidence.array("evidence", 5), tasksController.complete);

// PUT  /api/tasks/:id/verify  → admin aprueba o rechaza
router.put("/:id/verify", tasksController.verify);

// PUT    /api/tasks/:id/retry   → usuario reintenta tarea rechazada
router.put("/:id/retry", tasksController.retry);

// DELETE /api/tasks/:id         → eliminar tarea (admin)
router.delete("/:id", tasksController.delete);

export default router;
