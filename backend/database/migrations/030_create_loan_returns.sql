-- ── Migración 030 ──────────────────────────────────────────────────────────────
-- Registra el detalle de la devolución de cada material de un préstamo:
-- estado físico (solo devolutivos), cantidad sobrante (solo consumibles) y
-- observaciones. Un material solo puede tener un registro de devolución
-- (UNIQUE loan_item_id); si se vuelve a registrar, se actualiza.

CREATE TABLE IF NOT EXISTS public.loan_returns (
  loan_return_id   SERIAL PRIMARY KEY,
  loan_item_id     INTEGER NOT NULL
                       REFERENCES public.loan_items(loan_item_id)
                       ON DELETE CASCADE,
  item_state       VARCHAR(20)
                       CHECK (item_state IN ('Bueno', 'Dañado', 'Pérdida')),
  leftover_amount  INTEGER,
  observations     TEXT,
  returned_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE (loan_item_id)
);

CREATE INDEX IF NOT EXISTS idx_loan_returns_loan_item
  ON public.loan_returns (loan_item_id);
