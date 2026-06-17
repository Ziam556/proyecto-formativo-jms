import { Router } from "express";
import { accessController } from "./access.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.get("/check/:permissionCode", authenticateToken, accessController.checkPermission);

export default router;
