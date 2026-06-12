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
      res.status(500).json({ error: err.message });
    }
  },
};
