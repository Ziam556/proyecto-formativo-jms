// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import { userController } from "./user.controller.js";
import { upload } from "../../config/upload.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

// GET /api/users/me → datos del usuario autenticado (debe ir antes de /:id)
router.get("/me", authenticateToken, userController.getMe);

// GET /api/users → listar todos los usuarios
router.get("/", authenticateToken, userController.getAll);

// upload.single("userImage") intercepta el archivo antes de llegar al controller
router.post("/", upload.single("userImage"), userController.create);

// GET /api/users/:id/permissions → obtener permisos individuales del usuario
router.get("/:id/permissions", authenticateToken, userController.getUserPermissions);

// POST /api/users/:id/permissions → asignar permisos individuales
router.post("/:id/permissions", authenticateToken, userController.assignPermissions);

// PUT    /api/users/:id → actualizar usuario por número de documento
router.put("/:id",    authenticateToken, upload.single("userImage"), userController.update);

// PATCH  /api/users/:id/toggle → habilitar/deshabilitar usuario
router.patch("/:id/toggle", authenticateToken, userController.toggle);

// DELETE /api/users/:id → eliminar usuario por número de documento
router.delete("/:id", authenticateToken, userController.delete);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;

