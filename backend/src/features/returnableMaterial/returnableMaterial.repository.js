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
      materialEntryDate,
      materialInventory,
      materialQuotations,
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
        material_amount,
        material_unit_value,
        material_total_value,
        material_state,
        material_technical_sheet,
        material_description,
        material_location,
        material_width,
        material_length,
        material_depth,
        material_entry_date,
        material_inventory,
        material_quotations
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING returnable_material_id, material_element_name;
    `;

    const values = [
      returnableMaterialId, materialPlate, materialCategory, materialElementName,
      materialBrand || null, materialModel || null, materialSerial || null, materialImage,
      materialPurchaseDate ?? null, materialAmount,
      materialUnitValue, materialTotalValue, materialState,
      materialTechnicalSheet, materialDescription, materialLocation,
      materialWidth, materialLength, materialDepth,
      materialEntryDate ?? null,
      materialInventory ?? null,
      materialQuotations ?? null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ── Sincroniza cuentadantes de un material devolutivo ────────────────────
  async syncAccountholders(materialId, userIds) {
    await pool.query(
      `DELETE FROM public.returnable_material_accountholders WHERE returnable_material_id = $1`,
      [materialId]
    );
    if (!userIds.length) return;
    const vals = userIds.map((uid, i) => `($1, $${i + 2})`).join(", ");
    await pool.query(
      `INSERT INTO public.returnable_material_accountholders (returnable_material_id, user_id)
       VALUES ${vals} ON CONFLICT DO NOTHING`,
      [materialId, ...userIds]
    );
  },

  async findAll() {
    const result = await pool.query(`
      SELECT
        rm.returnable_material_id,
        rm.material_plate,
        rm.material_category,
        rm.material_element_name,
        rm.material_brand,
        rm.material_model,
        rm.material_serial,
        rm.material_image,
        rm.material_purchase_date,
        rm.material_amount,
        rm.material_unit_value,
        rm.material_total_value,
        rm.material_state,
        rm.material_technical_sheet,
        rm.material_description,
        rm.material_location,
        rm.material_width,
        rm.material_length,
        rm.material_depth,
        rm.material_purchase_date,
        rm.material_entry_date,
        rm.material_inventory,
        rm.material_quotations,
        rm.enabled,
        COALESCE(
          json_agg(
            json_build_object(
              'user_id',             u.user_id,
              'user_name',           u.user_name,
              'user_document_number',u.user_document_number
            )
          ) FILTER (WHERE u.user_id IS NOT NULL),
          '[]'::json
        ) AS accountholders
      FROM public.returnable_material rm
      LEFT JOIN public.returnable_material_accountholders rma
             ON rma.returnable_material_id = rm.returnable_material_id
      LEFT JOIN public.users u ON u.user_id = rma.user_id
      GROUP BY rm.returnable_material_id
      ORDER BY rm.material_element_name ASC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT
        rm.returnable_material_id,
        rm.material_plate,
        rm.material_category,
        rm.material_element_name,
        rm.material_brand,
        rm.material_model,
        rm.material_serial,
        rm.material_image,
        rm.material_purchase_date,
        rm.material_amount,
        rm.material_unit_value,
        rm.material_total_value,
        rm.material_state,
        rm.material_technical_sheet,
        rm.material_description,
        rm.material_location,
        rm.material_width,
        rm.material_length,
        rm.material_depth,
        rm.material_purchase_date,
        rm.material_entry_date,
        rm.material_inventory,
        rm.material_quotations,
        rm.enabled,
        COALESCE(
          json_agg(
            json_build_object(
              'user_id',             u.user_id,
              'user_name',           u.user_name,
              'user_document_number',u.user_document_number
            )
          ) FILTER (WHERE u.user_id IS NOT NULL),
          '[]'::json
        ) AS accountholders
      FROM public.returnable_material rm
      LEFT JOIN public.returnable_material_accountholders rma
             ON rma.returnable_material_id = rm.returnable_material_id
      LEFT JOIN public.users u ON u.user_id = rma.user_id
      WHERE rm.returnable_material_id = $1
      GROUP BY rm.returnable_material_id
    `, [id]);
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
      materialPurchaseDate, materialEntryDate,
      materialAmount, materialUnitValue, materialTotalValue,
      materialState, materialDescription, materialLocation,
      materialWidth, materialLength, materialDepth, isEnabled,
      materialInventory, materialQuotations,
    } = data;

    const query = `
      UPDATE public.returnable_material SET
        material_plate           = $1,
        material_category        = $2,
        material_element_name    = $3,
        material_brand           = $4,
        material_model           = $5,
        material_serial          = $6,
        material_image           = COALESCE($7, material_image),
        material_technical_sheet = COALESCE($8, material_technical_sheet),
        material_amount          = $9,
        material_unit_value      = $10,
        material_total_value     = $11,
        material_state           = $12,
        material_description     = $13,
        material_location        = $14,
        material_width           = $15,
        material_length          = $16,
        material_depth           = $17,
        enabled                  = $18,
        material_purchase_date   = $19,
        material_entry_date      = $20,
        material_inventory       = $22,
        material_quotations      = COALESCE($23, material_quotations)
      WHERE returnable_material_id = $21
      RETURNING returnable_material_id;
    `;

    const values = [
      materialPlate, materialCategory, materialElementName,
      materialBrand || null, materialModel || null, materialSerial || null,
      materialImage || null, materialTechnicalSheet || null,
      materialAmount, materialUnitValue, materialTotalValue,
      materialState, materialDescription, materialLocation || null,
      materialWidth || null, materialLength || null, materialDepth || null,
      isEnabled ?? true,
      materialPurchaseDate || null, materialEntryDate || null,
      id,
      materialInventory ?? null,
      materialQuotations ?? null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] ?? null;
  },

};
