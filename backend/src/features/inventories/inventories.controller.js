import { inventoriesService } from "./inventories.service.js";

export const inventoriesController = {

    async getAll(req, res) {
        try {
            const inventories = await inventoriesService.getAll();
            res.json(inventories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const inv = await inventoriesService.getById(req.params.id);
            res.json(inv);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const inv = await inventoriesService.create(req.body);
            res.status(201).json({ inventory: inv });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const inv = await inventoriesService.update(req.params.id, req.body);
            res.json({ inventory: inv });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async toggleEnabled(req, res) {
        try {
            const { enabled } = req.body;
            const inv = await inventoriesService.toggleEnabled(req.params.id, enabled);
            res.json({ inventory: inv });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const inv = await inventoriesService.remove(req.params.id);
            res.json({ inventory: inv });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    },
};
