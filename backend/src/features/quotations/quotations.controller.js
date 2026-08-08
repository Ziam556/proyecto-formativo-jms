import { quotationsService } from "./quotations.service.js";

export const quotationsController = {

    async getAll(req, res) {
        try {
            const quotations = await quotationsService.getAll();
            res.json(quotations);
        } catch (err) {
            console.error("ERROR getAll quotations:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async add(req, res) {
        try {
            const { materialType, materialId } = req.body;

            if (!materialType || !materialId) {
                return res.status(400).json({ error: "Se requiere materialType y materialId." });
            }
            if (!["returnable", "consumable"].includes(materialType)) {
                return res.status(400).json({ error: "materialType debe ser 'returnable' o 'consumable'." });
            }
            if (!req.file) {
                return res.status(400).json({ error: "Se requiere un archivo PDF." });
            }

            const filePath = `uploads/quotations/${req.file.filename}`;
            await quotationsService.add({ materialType, materialId, filePath });

            res.status(201).json({ message: "Cotización agregada correctamente.", filePath });
        } catch (err) {
            console.error("ERROR add quotation:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const { materialType, materialId, filePath } = req.body;

            if (!materialType || !materialId || !filePath) {
                return res.status(400).json({ error: "Faltan datos: materialType, materialId o filePath." });
            }

            await quotationsService.remove({ materialType, materialId, filePath });
            res.json({ message: "Cotización eliminada correctamente." });
        } catch (err) {
            console.error("ERROR remove quotation:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
