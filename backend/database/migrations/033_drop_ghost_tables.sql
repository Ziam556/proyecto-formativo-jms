-- ── Migración 033 ──────────────────────────────────────────────────────────────
-- Elimina las tablas fantasma creadas por migrate.js (nombres estilo Django).
-- Estas tablas nunca fueron usadas por el backend y están completamente vacías.
-- Las tablas reales del sistema son: users, groups, permissions,
-- group_permissions, user_groups, user_permissions, tasks.
--
-- Se eliminan en orden para respetar las dependencias de FK entre ellas.
-- ──────────────────────────────────────────────────────────────────────────────

-- Tablas relacionales fantasma (dependen de app_user, auth_group, auth_permission)
DROP TABLE IF EXISTS public.user_permission  CASCADE;
DROP TABLE IF EXISTS public.user_group       CASCADE;
DROP TABLE IF EXISTS public.group_permission CASCADE;

-- Tablas base fantasma
DROP TABLE IF EXISTS public.app_user         CASCADE;
DROP TABLE IF EXISTS public.auth_permission  CASCADE;
DROP TABLE IF EXISTS public.auth_group       CASCADE;
DROP TABLE IF EXISTS public.content_type     CASCADE;

-- Tabla task (singular) duplicada de tasks (plural)
DROP TABLE IF EXISTS public.task             CASCADE;
