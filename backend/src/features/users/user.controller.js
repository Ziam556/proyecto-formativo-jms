import { userService } from "./user.service.js";

export const userController = {

  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);
    console.log("ARCHIVO RECIBIDO:", req.file);

    try {
      // Si se subió imagen, construimos la ruta relativa; si no, null
      const imagePath = req.file
        ? `uploads/profiles/${req.file.filename}`
        : null;

      const user = await userService.createUser({ ...req.body, userImage: imagePath });

      res.status(201).json({
        message: "Usuario creado correctamente",
        userId: user.user_id,
      });

    } catch (err) {
      console.error("ERROR BACKEND:", err);
      const status = err.message.includes("ya está registrado") ? 409 : 500;
      res.status(status).json({ error: err.message });
    }
  },

  async getMe(req, res) {
    try {
      const user = await userService.getMe(req.user.email);
      res.status(200).json(user);
    } catch (err) {
      console.error("ERROR getMe:", err);
      res.status(404).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (err) {
      console.error("ERROR getAll users:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getUserPermissions(req, res) {
    try {
      const { id } = req.params; // user_document_number
      const codenames = await userService.getUserPermissions(id);
      res.status(200).json(codenames);
    } catch (err) {
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

  async assignPermissions(req, res) {
    try {
      const { id } = req.params; // user_document_number
      const { codenames = [] } = req.body;
      const result = await userService.assignPermissions(id, codenames);
      res.status(200).json({ message: "Permisos asignados correctamente", ...result });
    } catch (err) {
      console.error("ERROR assignPermissions:", err);
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params; // user_document_number
      const imagePath = req.file
        ? `uploads/profiles/${req.file.filename}`
        : null;

      const updated = await userService.updateUser(id, {
        ...req.body,
        userImage: imagePath,
        isEnabled: req.body.isEnabled === "true" || req.body.isEnabled === true,
      });

      res.status(200).json({ message: "Usuario actualizado correctamente", user: updated });
    } catch (err) {
      console.error("ERROR update user:", err);
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      res.status(200).json({ message: "Usuario eliminado correctamente", user: deleted });
    } catch (err) {
      console.error("ERROR delete user:", err);
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },
};
