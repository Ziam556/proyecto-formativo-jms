import { returnableMaterialRepository } from "./returnableMaterial.repository.js";

export const returnableMaterialService = {

  async createReturnableMaterial(data) {
    console.log("SERVICE DATA:", data);
    return await returnableMaterialRepository.create(data);
  },

  async getAll() {
    return await returnableMaterialRepository.findAll();
  },

  async getById(id) {
    const material = await returnableMaterialRepository.findById(id);
    if (!material) throw new Error(`Material devolutivo con id ${id} no encontrado`);
    return material;
  },

  async toggleEnabled(id) {
    const updated = await returnableMaterialRepository.toggleEnabled(id);
    if (!updated) throw new Error(`Material devolutivo con id ${id} no encontrado`);
    return updated;
  },

  async updateReturnableMaterial(id, data) {
    const updated = await returnableMaterialRepository.update(id, data);
    if (!updated) throw new Error(`Material devolutivo con id ${id} no encontrado`);
    return updated;
  },

};
