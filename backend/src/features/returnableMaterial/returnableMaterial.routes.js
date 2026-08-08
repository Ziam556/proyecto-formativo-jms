import { Router } from "express";
import { returnableMaterialController } from "./returnableMaterial.controller.js";
import { upload } from "../../config/upload.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.use(authenticateToken);

// GET /api/returnableMaterial → listar todos
router.get("/", returnableMaterialController.getAll);

// GET /api/returnableMaterial/:id → obtener uno por id
router.get("/:id", returnableMaterialController.getById);

// POST /api/returnableMaterial → crear
router.post("/", upload.fields([
  { name: "materialImage",          maxCount: 5 },
  { name: "materialTechnicalSheet", maxCount: 1 },
  { name: "materialQuotation",      maxCount: 3 },
]), returnableMaterialController.create);

// PUT /api/returnableMaterial/:id → actualizar
router.put("/:id", upload.fields([
  { name: "materialImage",          maxCount: 5 },
  { name: "materialTechnicalSheet", maxCount: 1 },
  { name: "materialQuotation",      maxCount: 3 },
]), returnableMaterialController.update);

// PATCH  /api/returnableMaterial/:id/toggle → habilitar/deshabilitar
router.patch("/:id/toggle", returnableMaterialController.toggleEnabled);

// DELETE /api/returnableMaterial/:id → eliminar
router.delete("/:id", returnableMaterialController.delete);

export default router;
