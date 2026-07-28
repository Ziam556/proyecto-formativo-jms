import { Router } from "express";
import { loansController } from "./loans.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.use(authenticateToken);

router.post("/send-verification", loansController.sendVerification);
router.post("/verify-code",       loansController.verifyCode);

router.post("/",           loansController.create);
router.get("/",            loansController.getAll);
router.get("/:id",         loansController.getById);
router.put("/:id",         loansController.update);
router.patch("/:id/status",  loansController.updateStatus);
router.post("/:id/return",   loansController.registerReturn);
router.delete("/:id",        loansController.delete);

export default router;
