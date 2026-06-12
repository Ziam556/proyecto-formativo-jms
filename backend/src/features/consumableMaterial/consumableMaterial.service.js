import { consumableMaterialRepository } from "./consumableMaterial.repository.js";

export const consumableMaterialService = {

  async createConsumableMaterial(data) {
    console.log("SERVICE DATA:", data);
    return await consumableMaterialRepository.create(data);
  },

};
