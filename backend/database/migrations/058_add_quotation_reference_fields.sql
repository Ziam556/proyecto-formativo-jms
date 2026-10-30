-- Agrega campos de referencia libre a cotizaciones
-- y elimina la restricción que obligaba a tener exactamente un FK de material.

ALTER TABLE public.quotations
    ADD COLUMN IF NOT EXISTS quotation_reference_id TEXT,
    ADD COLUMN IF NOT EXISTS quotation_item_name    TEXT,
    ADD COLUMN IF NOT EXISTS quotation_date         DATE;

-- La restricción one_material_type ya no aplica: ambas FK pueden ser NULL.
ALTER TABLE public.quotations
    DROP CONSTRAINT IF EXISTS one_material_type;
