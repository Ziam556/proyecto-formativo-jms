import { pool } from "../../config/db.js";

// Mapa de tipo → nombre de tabla
const TABLE_MAP = {
  state:         "catalog_state",
  document_type: "catalog_document_type",
  user_type:     "catalog_user_type",
  category:      "catalog_category",
  material_type: "catalog_material_type",
};

export const catalogsRepository = {

  async findByType(type) {
    const table = TABLE_MAP[type];
    if (!table) throw new Error(`Tipo de catálogo inválido: ${type}`);

    const result = await pool.query(
      `SELECT code AS id, label FROM ${table} ORDER BY id ASC`
    );
    return result.rows;
  },

};
