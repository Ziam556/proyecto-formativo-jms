import { consumableMaterialRepository } from "./consumableMaterial.repository.js";

export const consumableMaterialService = {

  async createConsumableMaterial(data) {
    return await consumableMaterialRepository.create(data);
  },

  async getAll() {
    return await consumableMaterialRepository.findAll();
  },

  async getById(id) {
    const material = await consumableMaterialRepository.findById(id);
    if (!material) throw new Error(`Material de consumo con id ${id} no encontrado`);
    return material;
  },

  async update(id, data) {
    const updated = await consumableMaterialRepository.update(id, data);
    if (!updated) throw new Error(`Material de consumo con id ${id} no encontrado`);
    return updated;
  },

  async toggleEnabled(id, enabled) {
    if (typeof enabled !== "boolean") throw new Error("El campo enabled debe ser booleano");
    const updated = await consumableMaterialRepository.toggleEnabled(id, enabled);
    if (!updated) throw new Error(`Material de consumo con id ${id} no encontrado`);
    return updated;
  },

  async delete(id) {
    const deleted = await consumableMaterialRepository.delete(id);
    if (!deleted) throw new Error(`Material de consumo con id ${id} no encontrado`);
    return deleted;
  },

};
