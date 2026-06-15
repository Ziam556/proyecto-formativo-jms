import { Router } from "express";
import { brandsController } from "./brands.controller.js";

const router = Router();

// GET    /brands         → obtener todas las marcas
router.get("/",                     brandsController.getAll);

// GET    /brands/:id     → obtener una marca por id
router.get("/:id",                  brandsController.getById);

// POST   /brands         → crear una marca
router.post("/",                    brandsController.create);

// PUT    /brands/:id     → actualizar nombre de una marca
router.put("/:id",                  brandsController.update);

// PATCH  /brands/:id/toggle → cambiar estado enabled
router.patch("/:id/toggle",         brandsController.toggleEnabled);

// DELETE /brands/:id     → eliminar una marca
router.delete("/:id",              brandsController.remove);

export default router;
