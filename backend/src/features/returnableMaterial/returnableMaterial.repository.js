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

};
