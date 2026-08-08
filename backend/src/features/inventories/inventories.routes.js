import { Router } from "express";
import { inventoriesController } from "./inventories.controller.js";

const router = Router();

router.get("/",           inventoriesController.getAll);
router.get("/:id",        inventoriesController.getById);
router.post("/",          inventoriesController.create);
router.put("/:id",        inventoriesController.update);
router.patch("/:id/toggle", inventoriesController.toggleEnabled);
router.delete("/:id",     inventoriesController.remove);

export default router;
