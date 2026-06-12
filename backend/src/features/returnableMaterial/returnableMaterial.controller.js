import { returnableMaterialService } from "./returnableMaterial.service.js";

export const  returnableMaterialController = {

  async create(req, res) {
    console.log("BODY RECIBIDO:", req.body);
    console.log("ARCHIVO RECIBIDO:", req.file);

    try {
      const imagePath = req.files?.materialImage?.[0]
        ? `uploads/returnable/${req.files.materialImage[0].filename}`
        : null;

      const technicalSheetPath = req.files?.materialTechnicalSheet?.[0]
        ? `uploads/returnable/${req.files.materialTechnicalSheet[0].filename}`
        : null;

      const material = await returnableMaterialService.createReturnableMaterial({
        ...req.body,
        materialImage: imagePath,
        materialTechnicalSheet: technicalSheetPath,
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

};
