import { Router } from "express";
import { loansController } from "./loans.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.use(authenticateToken);

router.post("/", loansController.create);
router.get("/", loansController.getAll);
router.get("/:id", loansController.getById);
router.patch("/:id/status", loansController.updateStatus);
router.post("/:id/return", loansController.registerReturn);

export default router;
