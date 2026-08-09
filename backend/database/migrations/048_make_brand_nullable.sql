-- Hace material_brand opcional (nullable) en ambas tablas de material
ALTER TABLE public.returnable_material  ALTER COLUMN material_brand DROP NOT NULL;
ALTER TABLE public.consumable_material  ALTER COLUMN material_brand DROP NOT NULL;
