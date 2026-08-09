import { pool } from "../../config/db.js";

export const consumableMaterialRepository = {

  async create(consumableMaterialData) {
    const {
      consumableMaterialId,
      materialPlate,
      materialElementName,
      materialCategory,
      materialBrand,
      materialImage,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      materialTechnicalSheet,
      materialEntryDate,
      materialInventory,
      materialQuotations,
    } = consumableMaterialData;

    const query = `
      INSERT INTO public.consumable_material (
        consumable_material_id,
        material_plate,
        material_element_name,
        material_category,
        material_brand,
        material_image,
        material_amount,
        material_unit_value,
        material_total_value,
        material_state,
        material_description,
        material_purchase_date,
        material_location,
        material_technical_sheet,
        material_entry_date,
        material_inventory,
        material_quotations
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *;
    `;

    const values = [
      consumableMaterialId,
      materialPlate,
      materialElementName,
      materialCategory ?? null,
      materialBrand || null,
      materialImage,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      materialTechnicalSheet ?? null,
      materialEntryDate ?? null,
      materialInventory ?? null,
      materialQuotations ?? null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ── Sincroniza los cuentadantes de un material (DELETE + INSERT) ─────────
  async syncAccountholders(materialId, userIds) {
    await pool.query(
      `DELETE FROM public.consumable_material_accountholders WHERE consumable_material_id = $1`,
      [materialId]
    );
    if (!userIds.length) return;
    const vals = userIds.map((uid, i) => `($1, $${i + 2})`).join(", ");
    await pool.query(
      `INSERT INTO public.consumable_material_accountholders (consumable_material_id, user_id)
       VALUES ${vals} ON CONFLICT DO NOTHING`,
      [materialId, ...userIds]
    );
  },

  async findAll() {
    const result = await pool.query(`
      SELECT
        cm.consumable_material_id,
        cm.material_plate,
        cm.material_element_name,
        cm.material_category,
        cm.material_brand,
        cm.material_image,
        cm.material_amount,
        cm.material_unit_value,
        cm.material_total_value,
        cm.material_state,
        cm.material_description,
        cm.material_purchase_date,
        cm.material_location,
        cm.material_technical_sheet,
        cm.material_entry_date,
        cm.material_inventory,
        cm.material_quotations,
        cm.enabled,
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
      FROM public.consumable_material cm
      LEFT JOIN public.consumable_material_accountholders cma
             ON cma.consumable_material_id = cm.consumable_material_id
      LEFT JOIN public.users u ON u.user_id = cma.user_id
      GROUP BY cm.consumable_material_id
      ORDER BY cm.material_element_name ASC
    `);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT
        cm.consumable_material_id,
        cm.material_plate,
        cm.material_element_name,
        cm.material_category,
        cm.material_brand,
        cm.material_image,
        cm.material_amount,
        cm.material_unit_value,
        cm.material_total_value,
        cm.material_state,
        cm.material_description,
        cm.material_purchase_date,
        cm.material_location,
        cm.material_technical_sheet,
        cm.material_entry_date,
        cm.material_inventory,
        cm.material_quotations,
        cm.enabled,
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
      FROM public.consumable_material cm
      LEFT JOIN public.consumable_material_accountholders cma
             ON cma.consumable_material_id = cm.consumable_material_id
      LEFT JOIN public.users u ON u.user_id = cma.user_id
      WHERE cm.consumable_material_id = $1
      GROUP BY cm.consumable_material_id
    `, [id]);
    return result.rows[0] ?? null;
  },

  async update(id, consumableMaterialData) {
    const {
      materialPlate,
      materialElementName,
      materialCategory,
      materialBrand,
      materialImage,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      isEnabled,
      materialTechnicalSheet,
      materialEntryDate,
      materialInventory,
      materialQuotations,
    } = consumableMaterialData;

    const sheetExpr = materialTechnicalSheet === undefined
      ? "COALESCE($15, material_technical_sheet)"
      : materialTechnicalSheet === ""
        ? "NULL"
        : "$15";

    const query = `
      UPDATE public.consumable_material
      SET
        material_plate           = $1,
        material_element_name    = $2,
        material_category        = $3,
        material_brand           = $4,
        material_image           = COALESCE($5, material_image),
        material_amount          = $6,
        material_unit_value      = $7,
        material_total_value     = $8,
        material_state           = $9,
        material_description     = $10,
        material_purchase_date   = $11,
        material_location        = $12,
        enabled                  = $13,
        material_entry_date      = $14,
        material_technical_sheet = ${sheetExpr},
        material_inventory       = $17,
        material_quotations      = COALESCE($18, material_quotations)
      WHERE consumable_material_id = $16
      RETURNING consumable_material_id;
    `;

    const values = [
      materialPlate,
      materialElementName,
      materialCategory ?? null,
      materialBrand || null,
      materialImage,
      materialAmount,
      materialUnitValue,
      materialTotalValue,
      materialState,
      materialDescription,
      materialPurchaseDate,
      materialLocation,
      isEnabled ?? true,
      materialEntryDate ?? null,
      materialTechnicalSheet !== "" ? (materialTechnicalSheet ?? null) : null,
      id,
      materialInventory ?? null,
      materialQuotations ?? null,
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
