import { Router } from "express";
import { consumableMaterialController } from "./consumableMaterial.controller.js";
import { upload } from "../../config/upload.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.use(authenticateToken);

// GET    /consumableMaterial         → listar todos
router.get("/", consumableMaterialController.getAll);

// GET    /consumableMaterial/:id     → obtener uno por id
router.get("/:id", consumableMaterialController.getById);

// POST   /consumableMaterial         → crear
router.post("/", upload.array("materialImage", 5), consumableMaterialController.create);

// PUT    /consumableMaterial/:id     → actualizar
router.put("/:id", upload.array("materialImage", 5), consumableMaterialController.update);

// PATCH  /consumableMaterial/:id/toggle → habilitar/deshabilitar
router.patch("/:id/toggle", consumableMaterialController.toggleEnabled);

// DELETE /consumableMaterial/:id → eliminar
router.delete("/:id", consumableMaterialController.delete);

export default router;
