import { Router } from "express";
import { catalogsController } from "./catalogs.controller.js";

const router = Router();

// GET /api/catalogs/:type
// Sin autenticación: los catálogos se necesitan también en el formulario de login/registro
router.get("/:type", catalogsController.getByType);

export default router;
