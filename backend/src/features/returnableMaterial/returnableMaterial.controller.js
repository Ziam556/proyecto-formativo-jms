import { returnableMaterialService } from "./returnableMaterial.service.js";

export const returnableMaterialController = {

  async create(req, res) {
    try {
      const imagePaths = req.files?.materialImage?.length
        ? JSON.stringify(req.files.materialImage.map((f) => `uploads/returnable/${f.filename}`))
        : null;

      const technicalSheetPath = req.files?.materialTechnicalSheet?.[0]
        ? `uploads/returnable/${req.files.materialTechnicalSheet[0].filename}`
        : null;

      const quotationPaths = (req.files?.materialQuotation ?? [])
        .map((f) => `uploads/returnable/${f.filename}`);
      const materialQuotations = quotationPaths.length ? JSON.stringify(quotationPaths) : null;

      const material = await returnableMaterialService.createReturnableMaterial({
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet: technicalSheetPath,
        materialQuotations,
      });

      res.status(201).json({
        message: "Material devolutivo creado correctamente",
        returnableMaterialId: material.returnable_material_id,
      });

    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const materials = await returnableMaterialService.getAll();
      res.status(200).json(materials);
    } catch (err) {
      console.error("ERROR getAll returnableMaterial:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const material = await returnableMaterialService.getById(req.params.id);
      res.status(200).json(material);
    } catch (err) {
      console.error("ERROR getById returnableMaterial:", err);
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const imagePaths = req.files?.materialImage?.length
        ? JSON.stringify(req.files.materialImage.map((f) => `uploads/returnable/${f.filename}`))
        : null;

      const technicalSheetPath = req.files?.materialTechnicalSheet?.[0]
        ? `uploads/returnable/${req.files.materialTechnicalSheet[0].filename}`
        : null;

      const keptQuotations = req.body.keepQuotations
        ? JSON.parse(req.body.keepQuotations)
        : [];
      const newQuotationPaths = (req.files?.materialQuotation ?? [])
        .map((f) => `uploads/returnable/${f.filename}`);
      const allQuotations = [...keptQuotations, ...newQuotationPaths];
      const materialQuotations = allQuotations.length ? JSON.stringify(allQuotations) : null;

      const material = await returnableMaterialService.updateReturnableMaterial(req.params.id, {
        ...req.body,
        materialImage: imagePaths,
        materialTechnicalSheet: technicalSheetPath,
        materialQuotations,
        isEnabled: req.body.isEnabled === "true" || req.body.isEnabled === true,
      });

      res.status(200).json({ message: "Material devolutivo actualizado correctamente", material });
    } catch (err) {
      console.error("ERROR update returnableMaterial:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async toggleEnabled(req, res) {
    try {
      const material = await returnableMaterialService.toggleEnabled(req.params.id);
      const estado = material.enabled ? "habilitado" : "deshabilitado";
      res.status(200).json({ message: `Material ${estado} correctamente`, material });
    } catch (err) {
      console.error("ERROR toggleEnabled returnableMaterial:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await returnableMaterialService.delete(req.params.id);
      res.status(200).json({ message: "Material eliminado correctamente", material: deleted });
    } catch (err) {
      console.error("ERROR delete returnableMaterial:", err);
      const status = err.message.includes("no encontrado") ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },

};
