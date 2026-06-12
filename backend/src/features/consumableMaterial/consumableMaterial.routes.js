import { Router } from "express";
import { consumableMaterialController } from "./consumableMaterial.controller.js";
import { upload } from "../../config/upload.js";
const router = Router();

router.post("/", upload.single("materialImage"), consumableMaterialController.create);

export default router;
