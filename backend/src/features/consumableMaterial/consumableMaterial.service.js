import { consumableMaterialRepository } from "./consumableMaterial.repository.js";

// Extrae los user_id de la lista de cuentadantes enviada por el frontend
// Acepta JSON string o array de objetos {userId, user_id, ...}
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

export const consumableMaterialService = {

  async createConsumableMaterial(data) {
    const material = await consumableMaterialRepository.create(data);
    const userIds  = parseUserIds(data.materialStoryTeller);
    if (userIds.length) {
      await consumableMaterialRepository.syncAccountholders(
        material.consumable_material_id,
        userIds
      );
    }
    return material;
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
    const userIds = parseUserIds(data.materialStoryTeller);
    await consumableMaterialRepository.syncAccountholders(id, userIds);
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
