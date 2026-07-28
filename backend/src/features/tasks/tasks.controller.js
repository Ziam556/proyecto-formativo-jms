import { tasksService } from "./tasks.service.js";

export const tasksController = {

  async create(req, res) {
    try {
      const task = await tasksService.createTask(req.body, req.user.email);
      res.status(201).json(task);
    } catch (err) {
      console.error("ERROR create task:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const { status, search } = req.query;
      const tasks = await tasksService.getAll({ status, search });
      res.json(tasks);
    } catch (err) {
      console.error("ERROR getAll tasks:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const task = await tasksService.getById(Number(req.params.id));
      res.json(task);
    } catch (err) {
      const status = err.message.includes("no encontrada") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

  async getMyTasks(req, res) {
    try {
      const tasks = await tasksService.getMyTasks(req.user.email);
      res.json(tasks);
    } catch (err) {
      console.error("ERROR getMyTasks:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async complete(req, res) {
    try {
      const files = req.files ?? [];
      const userComment = req.body.userComment ?? null;
      const task = await tasksService.completeTask(Number(req.params.id), req.user.email, files, userComment);
      res.json({ message: "Tarea enviada a verificación", task });
    } catch (err) {
      console.error("ERROR complete task:", err);
      const status = err.message.includes("no encontrada") ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  },

  async verify(req, res) {
    try {
      const { action, adminComment } = req.body; // action: 'aprobar' | 'rechazar'
      const task = await tasksService.verifyTask(
        Number(req.params.id),
        { action, adminComment },
        req.user.email
      );
      res.json({ message: `Tarea ${action === 'aprobar' ? 'aprobada' : 'rechazada'} correctamente`, task });
    } catch (err) {
      console.error("ERROR verify task:", err);
      const status = err.message.includes("no encontrada") ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  },

  async retry(req, res) {
    try {
      const task = await tasksService.retryTask(Number(req.params.id), req.user.email);
      res.json({ message: "Tarea lista para reintentar", task });
    } catch (err) {
      console.error("ERROR retry task:", err);
      const status = err.message.includes("no encontrada") ? 404 : 400;
      res.status(status).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await tasksService.delete(Number(req.params.id));
      res.status(200).json({ message: "Tarea eliminada correctamente", task: deleted });
    } catch (err) {
      console.error("ERROR delete task:", err);
      const status = err.message.includes("no encontrada") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },
};
