import { returnableMaterialRepository } from "./returnableMaterial.repository.js";

function parseUserIds(raw) {
  if (!raw) return [];
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    return arr
      .map((h) => Number(h.userId ?? h.user_id))
      .filter((id) => id && !isNaN(id));
  } catch {
    return [];
  }
}

export const returnableMaterialService = {

  async createReturnableMaterial(data) {
    const material = await returnableMaterialRepository.create(data);
    const userIds  = parseUserIds(data.materialStoryTeller);
    if (userIds.length) {
      await returnableMaterialRepository.syncAccountholders(
        material.returnable_material_id,
        userIds
      );
    }
    return material;
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
    const userIds = parseUserIds(data.materialStoryTeller);
    await returnableMaterialRepository.syncAccountholders(id, userIds);
    return updated;
  },

  async delete(id) {
    const deleted = await returnableMaterialRepository.delete(id);
    if (!deleted) throw new Error(`Material devolutivo con id ${id} no encontrado`);
    return deleted;
  },

};
