import { consumableMaterialService } from "./consumableMaterial.service.js";

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

      const quotationFiles = req.files?.materialQuotation ?? [];
      const quotationPaths = quotationFiles.map((f) => `uploads/consumable/${f.filename}`);
      const materialQuotations = quotationPaths.length ? JSON.stringify(quotationPaths) : null;

      const material = await consumableMaterialService.createConsumableMaterial({
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet,
        materialQuotations,
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

      // Cotizaciones: kept existing + new uploads
      const keptQuotations = req.body.keepQuotations
        ? JSON.parse(req.body.keepQuotations)
        : [];
      const newQuotationPaths = (req.files?.materialQuotation ?? [])
        .map((f) => `uploads/consumable/${f.filename}`);
      const allQuotations = [...keptQuotations, ...newQuotationPaths];
      const materialQuotations = allQuotations.length ? JSON.stringify(allQuotations) : null;

      const material = await consumableMaterialService.update(req.params.id, {
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet,
        materialQuotations,
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
