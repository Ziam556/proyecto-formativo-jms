-- Columna para almacenar rutas de cotizaciones (JSON array de hasta 3 PDFs)
ALTER TABLE public.consumable_material
  ADD COLUMN IF NOT EXISTS material_quotations TEXT;

ALTER TABLE public.returnable_material
  ADD COLUMN IF NOT EXISTS material_quotations TEXT;
