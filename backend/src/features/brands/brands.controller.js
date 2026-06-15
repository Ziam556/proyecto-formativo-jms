import { brandsService } from "./brands.service.js";

export const brandsController = {

    async getAll(req, res) {
        try {
            const brands = await brandsService.getAll();
            res.status(200).json(brands);
        } catch (err) {
            console.error("ERROR getAll brands:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const brand = await brandsService.getById(Number(req.params.id));
            res.status(200).json(brand);
        } catch (err) {
            console.error("ERROR getById brand:", err);
            res.status(404).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const brand = await brandsService.create(req.body);
            res.status(201).json({ message: "Marca creada correctamente", brand });
        } catch (err) {
            console.error("ERROR create brand:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const brand = await brandsService.update(Number(req.params.id), req.body);
            res.status(200).json({ message: "Marca actualizada correctamente", brand });
        } catch (err) {
            console.error("ERROR update brand:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async toggleEnabled(req, res) {
        try {
            const brand = await brandsService.toggleEnabled(
                Number(req.params.id),
                req.body.enabled
            );
            res.status(200).json({ message: "Estado actualizado correctamente", brand });
        } catch (err) {
            console.error("ERROR toggleEnabled brand:", err);
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const brand = await brandsService.remove(Number(req.params.id));
            res.status(200).json({ message: "Marca eliminada correctamente", brand });
        } catch (err) {
            console.error("ERROR remove brand:", err);
            res.status(404).json({ error: err.message });
        }
    },
};
