import { categoriesService } from "./categories.service.js";

export const categoriesController = {

    async getAll(req, res) {
        try {
            const categories = await categoriesService.getAll();
            res.status(200).json(categories);
        } catch (err) {
            console.error("ERROR getAll categories:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const category = await categoriesService.getById(Number(req.params.id));
            res.status(200).json(category);
        } catch (err) {
            console.error("ERROR getById category:", err);
            res.status(404).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const category = await categoriesService.create(req.body);
            res.status(201).json({ message: "Categoría creada correctamente", category });
        } catch (err) {
            console.error("ERROR create category:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const category = await categoriesService.update(Number(req.params.id), req.body);
            res.status(200).json({ message: "Categoría actualizada correctamente", category });
        } catch (err) {
            console.error("ERROR update category:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async toggleEnabled(req, res) {
        try {
            const category = await categoriesService.toggleEnabled(
                Number(req.params.id),
                req.body.enabled
            );
            res.status(200).json({ message: "Estado actualizado correctamente", category });
        } catch (err) {
            console.error("ERROR toggleEnabled category:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const category = await categoriesService.remove(Number(req.params.id));
            res.status(200).json({ message: "Categoría eliminada correctamente", category });
        } catch (err) {
            console.error("ERROR remove category:", err);
            res.status(404).json({ error: err.message });
        }
    },
};
