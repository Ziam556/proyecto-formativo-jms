-- ─────────────────────────────────────────────────────────────────────────
-- 043 – Agregar campo fecha de ingreso a materiales consumibles y devolutivos
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.consumable_material
    ADD COLUMN IF NOT EXISTS material_entry_date DATE;

ALTER TABLE public.returnable_material
    ADD COLUMN IF NOT EXISTS material_entry_date DATE;
