import { catalogsService } from "./catalogs.service.js";

export const catalogsController = {

  async getByType(req, res) {
    try {
      const items = await catalogsService.getByType(req.params.type);
      res.status(200).json(items);
    } catch (err) {
      console.error("ERROR getByType catalogs:", err);
      res.status(400).json({ error: err.message });
    }
  },

};
