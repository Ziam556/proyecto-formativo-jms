import { pool } from "../../config/db.js";

export const loansRepository = {
    async create(loanData) {
        const {
            fileGroup,
            amount,
            departureDate,
            deliveryDate,
            justification,
            requestingUser,
            verificationCode,
            loanType,
        } = loanData;

        const result = await pool.query(
            `INSERT INTO public.loans
                (file_group, amount, departure_date, delivery_date, justification, requesting_user, verification_code, loan_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [fileGroup, amount, departureDate, deliveryDate, justification, requestingUser, verificationCode, loanType ?? "interno"]
        );

        return result.rows[0];
    },

    async createItems(loanId, items) {
        if (!items.length) return;

        // 6 columnas por ítem: material_name, material_type, amount,
        // returnable_material_id, consumable_material_id, delivery_date
        const values = items
            .map((_, i) => `($1, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6}, $${i * 6 + 7})`)
            .join(", ");

        const params = [loanId];
        items.forEach((item) => {
            const isReturnable = item.materialType === "M.D";
            const isConsumable = item.materialType === "M.C";
            params.push(
                item.materialName,
                item.materialType,
                item.amount ?? null,
                isReturnable ? (item.materialId ?? null) : null,   // returnable_material_id
                isConsumable ? (item.materialId ?? null) : null,   // consumable_material_id
                item.deliveryDate ?? null,                          // delivery_date por ítem
            );
        });

        await pool.query(
            `INSERT INTO public.loan_items
                (loan_id, material_name, material_type, amount, returnable_material_id, consumable_material_id, delivery_date)
             VALUES ${values}`,
            params
        );
    },

    async findAll() {
        const result = await pool.query(
            `SELECT
                l.*,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'name',   li.material_name,
                            'type',   CASE WHEN li.material_type = 'M.D' THEN 'Devolutivo' ELSE 'Consumo' END,
                            'amount', li.amount
                        )
                    ) FILTER (WHERE li.loan_item_id IS NOT NULL),
                    '[]'::json
                ) AS materiales
             FROM public.loans l
             LEFT JOIN public.loan_items li ON li.loan_id = l.loan_id
             GROUP BY l.loan_id
             ORDER BY l.created_at DESC`
        );
        return result.rows;
    },

    async findById(loanId) {
        const loan = await pool.query(
            `SELECT * FROM public.loans WHERE loan_id = $1`,
            [loanId]
        );
        const items = await pool.query(
            `SELECT
                li.*,
                lr.item_state,
                lr.leftover_amount,
                lr.observations,
                lr.returned_at
             FROM public.loan_items li
             LEFT JOIN public.loan_returns lr ON lr.loan_item_id = li.loan_item_id
             WHERE li.loan_id = $1`,
            [loanId]
        );
        return { ...loan.rows[0], items: items.rows };
    },

    async update(loanId, { fileGroup, amount, departureDate, deliveryDate, justification, requestingUser, loanType }) {
        const result = await pool.query(
            `UPDATE public.loans
             SET file_group      = COALESCE($1, file_group),
                 amount          = COALESCE($2, amount),
                 departure_date  = COALESCE($3, departure_date),
                 delivery_date   = COALESCE($4, delivery_date),
                 justification   = COALESCE($5, justification),
                 requesting_user = COALESCE($6, requesting_user),
                 loan_type       = COALESCE($7, loan_type),
                 updated_at      = NOW()
             WHERE loan_id = $8
             RETURNING *`,
            [fileGroup ?? null, amount ?? null, departureDate ?? null, deliveryDate ?? null,
             justification ?? null, requestingUser ?? null, loanType ?? null, loanId]
        );
        return result.rows[0] ?? null;
    },

    async updateStatus(loanId, status) {
        const result = await pool.query(
            `UPDATE public.loans SET loan_status = $1, updated_at = NOW()
             WHERE loan_id = $2 RETURNING *`,
            [status, loanId]
        );
        return result.rows[0];
    },

    // ── Gestión de inventario ─────────────────────────────────────────────────

    /** Descuenta `amount` unidades de un consumible al crear el préstamo. */
    async decrementConsumableStock(materialId, amount) {
        await pool.query(
            `UPDATE public.consumable_material
             SET material_amount = GREATEST(material_amount - $2, 0)
             WHERE consumable_material_id = $1`,
            [materialId, amount]
        );
    },

    /** Marca un devolutivo como no disponible al salir en préstamo. */
    async disableReturnableMaterial(materialId) {
        await pool.query(
            `UPDATE public.returnable_material
             SET enabled = false
             WHERE returnable_material_id = $1`,
            [materialId]
        );
    },

    /**
     * Restaura unidades al devolver un consumible.
     * `amount` es la cantidad sobrante (leftover) reportada por el usuario.
     */
    async restoreConsumableStock(materialId, amount) {
        if (!amount || amount <= 0) return;
        await pool.query(
            `UPDATE public.consumable_material
             SET material_amount = material_amount + $2
             WHERE consumable_material_id = $1`,
            [materialId, amount]
        );
    },

    /**
     * Actualiza el estado de un devolutivo tras su devolución física.
     * - "Bueno" / "Dañado" → se re-habilita con el nuevo estado
     * - "Pérdida"          → queda deshabilitado permanentemente
     */
    async restoreReturnableMaterial(materialId, state) {
        const enabled      = state !== "Pérdida";
        const materialState = ["Bueno", "Dañado", "Pérdida"].includes(state) ? state : "Bueno";
        await pool.query(
            `UPDATE public.returnable_material
             SET enabled        = $2,
                 material_state = $3
             WHERE returnable_material_id = $1`,
            [materialId, enabled, materialState]
        );
    },

    /** Vuelve a habilitar un devolutivo sin cambiar su estado (usado al cancelar). */
    async enableReturnableMaterial(materialId) {
        await pool.query(
            `UPDATE public.returnable_material
             SET enabled = true
             WHERE returnable_material_id = $1`,
            [materialId]
        );
    },

    /**
     * Devuelve las referencias de material para una lista de loan_item_id.
     * Necesario para saber qué registro de inventario actualizar al devolver.
     */
    async getMaterialRefsByItemIds(itemIds) {
        if (!itemIds.length) return [];
        const result = await pool.query(
            `SELECT loan_item_id,
                    material_type,
                    returnable_material_id,
                    consumable_material_id
             FROM public.loan_items
             WHERE loan_item_id = ANY($1)`,
            [itemIds]
        );
        return result.rows;
    },

    // ── Helpers de usuario ───────────────────────────────────────────────────
    /**
     * Busca el email de un usuario por su nombre o número de documento.
     * Se usa para enviar notificaciones de actualización de préstamo,
     * ya que requesting_user almacena el nombre, no el email.
     */
    async findUserEmailByNameOrDoc(nameOrDoc) {
        if (!nameOrDoc) return null;
        const result = await pool.query(
            `SELECT user_email FROM public.users
             WHERE user_name = $1 OR user_document_number::text = $1
             LIMIT 1`,
            [String(nameOrDoc)]
        );
        return result.rows[0]?.user_email ?? null;
    },

    // ── Devoluciones ──────────────────────────────────────────────────────────
    async createReturns(returns) {
        if (!returns.length) return [];

        const values = returns
            .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
            .join(", ");

        const params = [];
        returns.forEach((r) => {
            params.push(r.loanItemId, r.state ?? null, r.leftoverAmount ?? null, r.observations ?? null);
        });

        const result = await pool.query(
            `INSERT INTO public.loan_returns (loan_item_id, item_state, leftover_amount, observations)
             VALUES ${values}
             ON CONFLICT (loan_item_id) DO UPDATE SET
                item_state      = EXCLUDED.item_state,
                leftover_amount = EXCLUDED.leftover_amount,
                observations    = EXCLUDED.observations,
                returned_at     = NOW()
             RETURNING *`,
            params
        );
        return result.rows;
    },

    async delete(loanId) {
        const result = await pool.query(
            `DELETE FROM public.loans WHERE loan_id = $1 RETURNING loan_id`,
            [loanId]
        );
        return result.rows[0] ?? null;
    },

    async countItemsAndReturns(loanId) {
        const total = await pool.query(
            `SELECT COUNT(*)::int AS total FROM public.loan_items WHERE loan_id = $1`,
            [loanId]
        );
        const returned = await pool.query(
            `SELECT COUNT(*)::int AS returned
             FROM public.loan_returns lr
             INNER JOIN public.loan_items li ON li.loan_item_id = lr.loan_item_id
             WHERE li.loan_id = $1`,
            [loanId]
        );
        return { total: total.rows[0].total, returned: returned.rows[0].returned };
    },
};
