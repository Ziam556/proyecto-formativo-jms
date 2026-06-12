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
        material_location
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING consumable_material_id, material_element_name;
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
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

};
