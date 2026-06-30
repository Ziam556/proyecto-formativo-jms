import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";
import { notificationsController } from "./notifications.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/",                    notificationsController.getMyNotifications);
router.get("/unread-count",        notificationsController.getUnreadCount);
router.put("/read-all",            notificationsController.markAllRead);
router.put("/:id/read",            notificationsController.markRead);

export default router;
