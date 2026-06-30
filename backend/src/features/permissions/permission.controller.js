import { permissionService } from "./permission.service.js";

export const permissionController = {

    async getAll(req, res) {
        try {
            const permissions = await permissionService.getAll();
            res.json(permissions);
        } catch (err) {
            console.error("ERROR getAll permissions:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const { name, codename, module } = req.body;
            const permission = await permissionService.create(name, codename, module);
            res.status(201).json(permission);
        } catch (err) {
            console.error("ERROR create permission:", err);
            const status = err.message.includes("ya está registrado") ? 409 : 500;
            res.status(status).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, codename, module } = req.body;
            const permission = await permissionService.update(id, { name, codename, module });
            res.json(permission);
        } catch (err) {
            console.error("ERROR update permission:", err);
            const status = err.message.includes("no encontrado") ? 404
                : err.message.includes("ya está en uso") ? 409 : 500;
            res.status(status).json({ error: err.message });
        }
    },
};
