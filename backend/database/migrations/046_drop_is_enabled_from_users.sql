-- Migración 046: eliminar columna is_enabled de users (campo muerto)
-- La autenticación usa "enabled AS is_enabled" (alias), no esta columna.
ALTER TABLE public.users DROP COLUMN IF EXISTS is_enabled;
