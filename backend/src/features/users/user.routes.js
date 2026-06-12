// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import { userController } from "./user.controller.js";
import { upload } from "../../config/upload.js";
const router = Router();

// upload.single("userImage") intercepta el archivo antes de llegar al controller
router.post("/", upload.single("userImage"), userController.create);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;

