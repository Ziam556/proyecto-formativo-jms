import { Router } from "express";
import { categoriesController } from "./categories.controller.js";

const router = Router();

// GET    /categories         → obtener todas las categorías
router.get("/",                 categoriesController.getAll);

// GET    /categories/:id     → obtener una categoría por id
router.get("/:id",              categoriesController.getById);

// POST   /categories         → crear una categoría
router.post("/",                categoriesController.create);

// PUT    /categories/:id     → actualizar nombre/prefix de una categoría
router.put("/:id",              categoriesController.update);

// PATCH  /categories/:id/toggle → cambiar estado enabled
router.patch("/:id/toggle",     categoriesController.toggleEnabled);

// DELETE /categories/:id     → eliminar una categoría
router.delete("/:id",          categoriesController.remove);

export default router;
