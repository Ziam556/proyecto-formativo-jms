-- ── Migración 032 ──────────────────────────────────────────────────────────────
-- Elimina la columna "user_type" de public.users.
-- El "tipo de usuario" fue reemplazado por el sistema de grupos
-- (tabla groups / user_groups, ver migraciones 003, 024 y 031).
-- Antes de aplicar esta migración se actualizó todo el código (backend y
-- frontend) para dejar de leer/escribir esta columna.

ALTER TABLE public.users
  DROP COLUMN IF EXISTS user_type;
