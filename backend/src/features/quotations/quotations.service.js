import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { quotationsRepository } from "./quotations.repository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const UPLOADS_ROOT = path.join(__dirname, "../../../../uploads");

export const quotationsService = {

    async getAll() {
        const rows = await quotationsRepository.findAll();
        return rows.map((r) => ({
            quotationId:         r.quotation_id,
            filePath:            r.file_path,
            fileName:            r.file_name,
            uploadedByEmail:     r.uploaded_by_email,
            uploadedAt:          r.uploaded_at,
            referenceId:         r.quotation_reference_id,
            itemName:            r.quotation_item_name,
            quotationDate:       r.quotation_date,
            inventoryName:       r.inventory_name,
            materialType:        r.material_type,
            materialId:          r.material_id ? String(r.material_id) : null,
            materialName:        r.material_name,
            category:            r.category,
        }));
    },

    async add({ referenceId, itemName, inventoryName, filePath, fileName, uploadedByEmail }) {
        return quotationsRepository.add({ referenceId, itemName, inventoryName, filePath, fileName, uploadedByEmail });
    },

    async remove({ quotationId }) {
        const deleted = await quotationsRepository.removeById(quotationId);
        if (!deleted) return;

        // Eliminar archivo físico
        try {
            const abs = path.join(UPLOADS_ROOT, deleted.file_path.replace(/^uploads[\\/]/, ""));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        } catch {
            // ignorar errores de fs
        }
    },
};
