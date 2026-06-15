import { brandsRepository } from "./brands.repository.js";

export const brandsService = {

    async getAll() {
        return await brandsRepository.findAll();
    },

    async getById(id) {
        const brand = await brandsRepository.findById(id);
        if (!brand) throw new Error(`Marca con id ${id} no encontrada`);
        return brand;
    },

    async create({ name }) {
        if (!name?.trim()) throw new Error("El nombre de la marca es requerido");
        return await brandsRepository.create({ name: name.trim() });
    },

    async update(id, { name }) {
        if (!name?.trim()) throw new Error("El nombre de la marca es requerido");
        const updated = await brandsRepository.update(id, { name: name.trim() });
        if (!updated) throw new Error(`Marca con id ${id} no encontrada`);
        return updated;
    },

    async toggleEnabled(id, enabled) {
        if (typeof enabled !== "boolean") throw new Error("El campo enabled debe ser booleano");
        const updated = await brandsRepository.toggleEnabled(id, enabled);
        if (!updated) throw new Error(`Marca con id ${id} no encontrada`);
        return updated;
    },

    async remove(id) {
        const deleted = await brandsRepository.remove(id);
        if (!deleted) throw new Error(`Marca con id ${id} no encontrada`);
        return deleted;
    },
};
