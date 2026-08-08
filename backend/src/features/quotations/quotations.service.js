import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { quotationsRepository } from "./quotations.repository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Ruta absoluta a la carpeta uploads (relativa a src/features/quotations/)
const UPLOADS_ROOT = path.join(__dirname, "../../../../uploads");

export const quotationsService = {

    async getAll() {
        return quotationsRepository.findAll();
    },

    async add({ materialType, materialId, filePath }) {
        if (materialType === "returnable") {
            await quotationsRepository.addToReturnable(materialId, filePath);
        } else {
            await quotationsRepository.addToConsumable(materialId, filePath);
        }
    },

    async remove({ materialType, materialId, filePath }) {
        // Eliminar archivo físico (ignorar si no existe)
        try {
            const abs = path.join(UPLOADS_ROOT, filePath.replace(/^uploads[\\/]/, ""));
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        } catch {
            // ignorar errores de fs
        }

        if (materialType === "returnable") {
            await quotationsRepository.removeFromReturnable(materialId, filePath);
        } else {
            await quotationsRepository.removeFromConsumable(materialId, filePath);
        }
    },
};
