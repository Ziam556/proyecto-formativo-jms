import { loansService } from "./loans.service.js";

export const loansController = {
    async create(req, res) {
        try {
            const loan = await loansService.create(req.body);
            res.status(201).json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const loans = await loansService.getAll();
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const loan = await loansService.getById(req.params.id);
            if (!loan) return res.status(404).json({ error: "Préstamo no encontrado" });
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const loan = await loansService.update(req.params.id, req.body);
            if (!loan) return res.status(404).json({ error: "Préstamo no encontrado" });
            res.json(loan);
        } catch (error) {
            res.status(error.message === "Préstamo no encontrado" ? 404 : 500).json({ error: error.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const loan = await loansService.updateStatus(req.params.id, req.body.status);
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async registerReturn(req, res) {
        try {
            const { items = [] } = req.body;
            const result = await loansService.registerReturn(req.params.id, items);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
