-- Migration: expand material_story_teller to TEXT in both tables
-- Needed to store a JSON array of multiple cuentadantes
-- e.g. [{"name":"Juan Pérez","document":"123456"},{"name":"María López","document":"654321"}]

ALTER TABLE public.consumable_material
  ALTER COLUMN material_story_teller TYPE TEXT;

ALTER TABLE public.returnable_material
  ALTER COLUMN material_story_teller TYPE TEXT;
