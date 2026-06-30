import { consumableMaterialService } from "./consumableMaterial.service.js";

export const consumableMaterialController = {

  async create(req, res) {
    try {
      const imagePaths = req.files?.length
        ? JSON.stringify(req.files.map((f) => `uploads/consumable/${f.filename}`))
        : null;

      const material = await consumableMaterialService.createConsumableMaterial({
        ...req.body,
        materialImage: imagePaths,
      });

      res.status(201).json({
        message: "Material consumible creado correctamente",
        consumableMaterialId: material.consumable_material_id,
      });

    } catch (err) {
      console.error("ERROR create consumableMaterial:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const materials = await consumableMaterialService.getAll();
      res.status(200).json(materials);
    } catch (err) {
      console.error("ERROR getAll consumableMaterial:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const material = await consumableMaterialService.getById(req.params.id);
      res.status(200).json(material);
    } catch (err) {
      console.error("ERROR getById consumableMaterial:", err);
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const imagePaths = req.files?.length
        ? JSON.stringify(req.files.map((f) => `uploads/consumable/${f.filename}`))
        : null;

      const material = await consumableMaterialService.update(req.params.id, {
        ...req.body,
        materialImage: imagePaths,
        isEnabled: req.body.isEnabled === "true" || req.body.isEnabled === true,
      });

      res.status(200).json({
        message: "Material consumible actualizado correctamente",
        material,
      });
    } catch (err) {
      console.error("ERROR update consumableMaterial:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async toggleEnabled(req, res) {
    try {
      const material = await consumableMaterialService.toggleEnabled(
        req.params.id,
        req.body.enabled
      );
      res.status(200).json({ message: "Estado actualizado correctamente", material });
    } catch (err) {
      console.error("ERROR toggleEnabled consumableMaterial:", err);
      res.status(400).json({ error: err.message });
    }
  },

};
