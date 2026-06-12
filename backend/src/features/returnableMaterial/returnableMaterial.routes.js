import { Router } from "express";
import { returnableMaterialController } from "./returnableMaterial.controller.js";
import { upload } from "../../config/upload.js";
const router = Router();

router.post("/", upload.fields([
  { name: "materialImage", maxCount: 1 },
  { name: "materialTechnicalSheet", maxCount: 1 },
]), returnableMaterialController.create);

export default router;
