import { catalogsRepository } from "./catalogs.repository.js";

export const catalogsService = {

  async getByType(type) {
    return await catalogsRepository.findByType(type);
  },

};
