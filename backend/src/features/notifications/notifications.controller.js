import { notificationsService } from "./notifications.service.js";

export const notificationsController = {

  // GET /api/notifications
  async getMyNotifications(req, res) {
    try {
      const notifications = await notificationsService.getMyNotifications(req.user.email);
      res.json(notifications);
    } catch (err) {
      console.error("ERROR getMyNotifications:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/notifications/unread-count
  async getUnreadCount(req, res) {
    try {
      const count = await notificationsService.getUnreadCount(req.user.email);
      res.json({ count });
    } catch (err) {
      console.error("ERROR getUnreadCount:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/notifications/:id/read
  async markRead(req, res) {
    try {
      await notificationsService.markRead(Number(req.params.id), req.user.email);
      res.json({ ok: true });
    } catch (err) {
      console.error("ERROR markRead:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/notifications/recent-loans  (solo admins)
  async getRecentLoans(req, res) {
    try {
      if (req.user.userGroup !== "Administrador") {
        return res.status(403).json({ error: "Acceso denegado" });
      }
      const loans = await notificationsService.getRecentLoans();
      res.json(loans);
    } catch (err) {
      console.error("ERROR getRecentLoans:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/notifications/read-all
  async markAllRead(req, res) {
    try {
      await notificationsService.markAllRead(req.user.email);
      res.json({ ok: true });
    } catch (err) {
      console.error("ERROR markAllRead:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
