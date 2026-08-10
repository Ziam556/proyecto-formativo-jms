import { consumableMaterialService } from "./consumableMaterial.service.js";
import { quotationsRepository } from "../quotations/quotations.repository.js";

export const consumableMaterialController = {

  async create(req, res) {
    try {
      const imageFiles = req.files?.materialImage ?? [];
      const imagePaths = imageFiles.length
        ? JSON.stringify(imageFiles.map((f) => `uploads/consumable/${f.filename}`))
        : null;

      const sheetFile = req.files?.materialTechnicalSheet?.[0];
      const materialTechnicalSheet = sheetFile
        ? `uploads/consumable/${sheetFile.filename}`
        : null;

      const material = await consumableMaterialService.createConsumableMaterial({
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet,
      });

      // Insertar cotizaciones en la tabla separada
      const quotationFiles = req.files?.materialQuotation ?? [];
      if (quotationFiles.length > 0) {
        await Promise.all(
          quotationFiles.map((f) =>
            quotationsRepository.add({
              materialType:    "consumable",
              materialId:      material.consumable_material_id,
              filePath:        `uploads/consumable/${f.filename}`,
              fileName:        f.originalname,
              uploadedByEmail: req.user?.email ?? null,
            })
          )
        );
      }

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
      const imageFiles = req.files?.materialImage ?? [];
      const imagePaths = imageFiles.length
        ? JSON.stringify(imageFiles.map((f) => `uploads/consumable/${f.filename}`))
        : null;

      const sheetFile = req.files?.materialTechnicalSheet?.[0];
      const materialTechnicalSheet = sheetFile
        ? `uploads/consumable/${sheetFile.filename}`
        : req.body.removeSheet === "true"
          ? ""          // vacío → el repo pondrá NULL
          : undefined;  // undefined → el repo usará COALESCE para no tocar el valor

      const material = await consumableMaterialService.update(req.params.id, {
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet,
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

  async delete(req, res) {
    try {
      const deleted = await consumableMaterialService.delete(req.params.id);
      res.status(200).json({ message: "Material eliminado correctamente", material: deleted });
    } catch (err) {
      console.error("ERROR delete consumableMaterial:", err);
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

};
