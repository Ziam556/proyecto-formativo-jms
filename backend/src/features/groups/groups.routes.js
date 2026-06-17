import { Router } from "express";
import { groupsController } from "./groups.controller.js";

const router = Router();

router.get("/", groupsController.getAll);
router.get("/:groupId/permissions", groupsController.getGroupPermissions);
router.post("/", groupsController.create);

export default router;
