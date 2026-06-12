import { consumableMaterialService } from "./consumableMaterial.service.js";

export const consumableMaterialController = {

  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);
    console.log("ARCHIVO RECIBIDO:", req.file);

    try {
      const imagePath = req.file
        ? `uploads/consumable/${req.file.filename}`
        : null;

      const material = await consumableMaterialService.createConsumableMaterial({
        ...req.body,
        materialImage: imagePath,
      });

      res.status(201).json({
        message: "Material consumible creado correctamente",
        consumableMaterialId: material.consumable_material_id,
      });

    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

};
