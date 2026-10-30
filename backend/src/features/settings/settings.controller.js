import { settingsRepository } from "./settings.repository.js";

export const settingsController = {
    async getContactEmail(req, res) {
        try {
            const value = await settingsRepository.get("contact_email");
            res.json({ key: "contact_email", value: value ?? "" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateContactEmail(req, res) {
        try {
            const { value } = req.body;
            if (!value || typeof value !== "string" || !value.includes("@")) {
                return res.status(400).json({ error: "Correo inválido" });
            }
            const updated = await settingsRepository.set("contact_email", value.trim());
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
