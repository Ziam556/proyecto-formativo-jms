import { Router } from "express";
import { groupsController } from "./groups.controller.js";

const router = Router();

router.get("/", groupsController.getAll);
router.get("/permissions", groupsController.getAllPermissions);
router.get("/:groupId/permissions", groupsController.getGroupPermissions);
router.get("/:groupId/users", groupsController.getGroupUsers);
router.post("/", groupsController.create);
router.post("/:groupId/users", groupsController.addUsers);
router.delete("/:groupId/users", groupsController.removeUsers);
router.delete("/:groupId",       groupsController.delete);
router.put("/:groupId",          groupsController.update);

export default router;
