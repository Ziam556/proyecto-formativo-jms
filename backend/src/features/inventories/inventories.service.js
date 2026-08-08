import { inventoriesRepository } from "./inventories.repository.js";

export const inventoriesService = {

    async getAll() {
        return inventoriesRepository.findAll();
    },

    async getById(id) {
        const inv = await inventoriesRepository.findById(id);
        if (!inv) throw new Error("Inventario no encontrado");
        return inv;
    },

    async create({ name }) {
        const trimmed = name?.trim();
        if (!trimmed) throw new Error("El nombre del inventario es requerido");
        return inventoriesRepository.create({ name: trimmed });
    },

    async update(id, { name }) {
        const trimmed = name?.trim();
        if (!trimmed) throw new Error("El nombre del inventario es requerido");
        const updated = await inventoriesRepository.update(id, { name: trimmed });
        if (!updated) throw new Error("Inventario no encontrado");
        return updated;
    },

    async toggleEnabled(id, enabled) {
        const updated = await inventoriesRepository.toggleEnabled(id, enabled);
        if (!updated) throw new Error("Inventario no encontrado");
        return updated;
    },

    async remove(id) {
        const removed = await inventoriesRepository.remove(id);
        if (!removed) throw new Error("Inventario no encontrado");
        return removed;
    },
};
