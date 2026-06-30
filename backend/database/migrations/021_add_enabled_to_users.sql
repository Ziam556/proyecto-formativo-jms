-- Migración 021: agregar columna enabled a la tabla users
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT TRUE;
