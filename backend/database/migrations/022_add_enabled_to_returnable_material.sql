-- Migración 022: agregar columna enabled a returnable_material
ALTER TABLE public.returnable_material
    ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT TRUE;
