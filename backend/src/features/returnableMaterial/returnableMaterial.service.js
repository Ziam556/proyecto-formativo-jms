import { returnableMaterialRepository } from "./returnableMaterial.repository.js";

export const returnableMaterialService = {

  async createReturnableMaterial(data) {
    console.log("SERVICE DATA:", data);
    return await returnableMaterialRepository.create(data);
  },

};
