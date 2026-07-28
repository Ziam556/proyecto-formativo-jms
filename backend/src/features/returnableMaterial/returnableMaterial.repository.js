import { pool } from "../../config/db.js";

export const returnableMaterialRepository = {

  async create(data) {
    const {
      returnableMaterialId,
      materialPlate,
      materialCategory,
      materialElementName,
      materialBrand,
      materialModel,
      materialSerial,
      materialImage,
      materialPurchaseDate,
      materialStoryTeller,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialTechnicalSheet,
      materialDescription,
      materialLocation,
      materialWidth,
      materialLength,
      materialDepth,
    } = data;

    const query = `
      INSERT INTO public.returnable_material (
        returnable_material_id,
        material_plate,
        material_category,
        material_element_name,
        material_brand,
        material_model,
        material_serial,
        material_image,
        material_purchase_date,
        material_story_teller,
        material_amount,
        material_unit_value,
        material_total_value,
        material_state,
        material_technical_sheet,
        material_description,
        material_location,
        material_width,
        material_length,
        material_depth
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING returnable_material_id, material_element_name;
    `;

    const values = [
      returnableMaterialId, materialPlate, materialCategory, materialElementName,
      materialBrand, materialModel, materialSerial, materialImage,
      materialPurchaseDate, materialStoryTeller, materialAmount,
      materialUnitValue, materialTotalValue, materialState,
      materialTechnicalSheet, materialDescription, materialLocation,
      materialWidth, materialLength, materialDepth,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query(
      `SELECT * FROM public.returnable_material ORDER BY material_element_name ASC`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM public.returnable_material WHERE returnable_material_id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM public.returnable_material WHERE returnable_material_id = $1
       RETURNING returnable_material_id, material_element_name`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async toggleEnabled(id) {
    const result = await pool.query(
      `UPDATE public.returnable_material
       SET enabled = NOT enabled
       WHERE returnable_material_id = $1
       RETURNING returnable_material_id, material_element_name, enabled`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async update(id, data) {
    const {
      materialPlate, materialCategory, materialElementName,
      materialBrand, materialModel, materialSerial,
      materialImage, materialTechnicalSheet,
      materialStoryTeller, materialAmount, materialUnitValue, materialTotalValue,
      materialState, materialDescription, materialLocation,
      materialWidth, materialLength, materialDepth, isEnabled,
    } = data;

    const query = `
      UPDATE public.returnable_material SET
        material_plate          = $1,
        material_category       = $2,
        material_element_name   = $3,
        material_brand          = $4,
        material_model          = $5,
        material_serial         = $6,
        material_image          = COALESCE($7, material_image),
        material_technical_sheet= COALESCE($8, material_technical_sheet),
        material_story_teller   = $9,
        material_amount         = $10,
        material_unit_value     = $11,
        material_total_value    = $12,
        material_state          = $13,
        material_description    = $14,
        material_location       = $15,
        material_width          = $16,
        material_length         = $17,
        material_depth          = $18,
        enabled                 = $19
      WHERE returnable_material_id = $20
      RETURNING *;
    `;

    const values = [
      materialPlate, materialCategory, materialElementName,
      materialBrand, materialModel || null, materialSerial || null,
      materialImage || null, materialTechnicalSheet || null,
      materialStoryTeller, materialAmount, materialUnitValue, materialTotalValue,
      materialState, materialDescription, materialLocation || null,
      materialWidth || null, materialLength || null, materialDepth || null,
      isEnabled ?? true,
      id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
  },

};
