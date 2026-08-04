import { pool } from "../../config/db.js";

export const consumableMaterialRepository = {

  async create(consumableMaterialData) {

    const {
      consumableMaterialId,
      materialPlate,
      materialElementName,
      materialBrand,
      materialImage,
      materialStoryTeller,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      materialTechnicalSheet,
    } = consumableMaterialData;

    const query = `
      INSERT INTO public.consumable_material (
        consumable_material_id,
        material_plate,
        material_element_name,
        material_brand,
        material_image,
        material_story_teller,
        material_amount,
        material_unit_value,
        material_total_value,
        material_state,
        material_description,
        material_purchase_date,
        material_location,
        material_technical_sheet
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *;
    `;

    const values = [
      consumableMaterialId,
      materialPlate,
      materialElementName,
      materialBrand,
      materialImage,
      materialStoryTeller,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      materialTechnicalSheet ?? null,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  // Obtener todos los materiales de consumo
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM public.consumable_material ORDER BY material_element_name ASC`
    );
    return result.rows;
  },

  // Obtener un material de consumo por id
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM public.consumable_material WHERE consumable_material_id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  // Actualizar un material de consumo
  async update(id, consumableMaterialData) {

    const {
      materialPlate,
      materialElementName,
      materialBrand,
      materialImage,
      materialStoryTeller,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      isEnabled,
      materialTechnicalSheet,
    } = consumableMaterialData;

    // materialTechnicalSheet:
    //   undefined → don't touch existing value (COALESCE)
    //   ""        → set to NULL (user removed the sheet)
    //   "path/..."→ update to new path
    const sheetExpr = materialTechnicalSheet === undefined
      ? "COALESCE($14, material_technical_sheet)"
      : materialTechnicalSheet === ""
        ? "NULL"
        : "$14";

    const query = `
      UPDATE public.consumable_material
      SET
        material_plate          = $1,
        material_element_name   = $2,
        material_brand          = $3,
        material_image          = COALESCE($4, material_image),
        material_story_teller   = $5,
        material_amount         = $6,
        material_unit_value     = $7,
        material_total_value    = $8,
        material_state          = $9,
        material_description    = $10,
        material_purchase_date  = $11,
        material_location       = $12,
        enabled                 = $13,
        material_technical_sheet = ${sheetExpr}
      WHERE consumable_material_id = $15
      RETURNING *;
    `;

    const values = [
      materialPlate,
      materialElementName,
      materialBrand,
      materialImage,
      materialStoryTeller,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      isEnabled ?? true,
      materialTechnicalSheet !== "" ? (materialTechnicalSheet ?? null) : null,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM public.consumable_material WHERE consumable_material_id = $1
       RETURNING consumable_material_id, material_element_name`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  // Cambiar estado enabled de un material de consumo
  async toggleEnabled(id, enabled) {
    const result = await pool.query(
      `UPDATE public.consumable_material
       SET enabled = $1
       WHERE consumable_material_id = $2
       RETURNING *`,
      [enabled, id]
    );
    return result.rows[0] ?? null;
  },

};
