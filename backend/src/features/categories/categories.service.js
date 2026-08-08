import { categoriesRepository } from "./categories.repository.js";

export const categoriesService = {

    async getAll() {
        return await categoriesRepository.findAll();
    },

    async getById(id) {
        const cat = await categoriesRepository.findById(id);
        if (!cat) throw new Error(`Categoría con id ${id} no encontrada`);
        return cat;
    },

    async create({ name, prefix }) {
        if (!name?.trim()) throw new Error("El nombre de la categoría es requerido");
        return await categoriesRepository.create({
            name:   name.trim(),
            prefix: (prefix ?? "").trim().toUpperCase(),
        });
    },

    async update(id, { name, prefix }) {
        if (name !== undefined && !name?.trim()) throw new Error("El nombre no puede estar vacío");
        const updated = await categoriesRepository.update(id, {
            name:   name?.trim()   ?? null,
            prefix: prefix?.trim().toUpperCase() ?? null,
        });
        if (!updated) throw new Error(`Categoría con id ${id} no encontrada`);
        return updated;
    },

    async toggleEnabled(id, enabled) {
        if (typeof enabled !== "boolean") throw new Error("El campo enabled debe ser booleano");
        const updated = await categoriesRepository.toggleEnabled(id, enabled);
        if (!updated) throw new Error(`Categoría con id ${id} no encontrada`);
        return updated;
    },

    async remove(id) {
        const deleted = await categoriesRepository.remove(id);
        if (!deleted) throw new Error(`Categoría con id ${id} no encontrada`);
        return deleted;
    },
};
