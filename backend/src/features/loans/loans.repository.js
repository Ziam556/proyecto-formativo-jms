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
        } = loanData;

        const result = await pool.query(
            `INSERT INTO public.loans
                (file_group, amount, departure_date, delivery_date, justification, requesting_user, verification_code)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [fileGroup, amount, departureDate, deliveryDate, justification, requestingUser, verificationCode]
        );

        return result.rows[0];
    },

    async createItems(loanId, items) {
        if (!items.length) return;

        const values = items
            .map((_, i) => `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4})`)
            .join(", ");

        const params = [loanId];
        items.forEach((item) => {
            params.push(item.materialName, item.materialType, item.amount);
        });

        await pool.query(
            `INSERT INTO public.loan_items (loan_id, material_name, material_type, amount) VALUES ${values}`,
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

    async updateStatus(loanId, status) {
        const result = await pool.query(
            `UPDATE public.loans SET loan_status = $1, updated_at = NOW()
             WHERE loan_id = $2 RETURNING *`,
            [status, loanId]
        );
        return result.rows[0];
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
