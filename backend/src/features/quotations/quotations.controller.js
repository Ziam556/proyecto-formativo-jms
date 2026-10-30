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
            const { referenceId, itemName, inventoryName } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: "Se requiere un archivo PDF." });
            }

            const filePath        = `uploads/quotations/${req.file.filename}`;
            const fileName        = req.file.originalname;
            const uploadedByEmail = req.user?.email ?? null;

            const quotation = await quotationsService.add({
                referenceId:   referenceId   || null,
                itemName:      itemName       || null,
                inventoryName: inventoryName  || null,
                filePath,
                fileName,
                uploadedByEmail,
            });

            res.status(201).json({ message: "Cotización agregada correctamente.", quotation });
        } catch (err) {
            console.error("ERROR add quotation:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const { quotationId } = req.body;

            if (!quotationId) {
                return res.status(400).json({ error: "Se requiere quotationId." });
            }

            await quotationsService.remove({ quotationId: Number(quotationId) });
            res.json({ message: "Cotización eliminada correctamente." });
        } catch (err) {
            console.error("ERROR remove quotation:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
