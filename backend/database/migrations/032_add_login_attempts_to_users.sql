-- Migración 032: columnas de bloqueo de cuenta por intentos fallidos
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS login_attempts INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until   TIMESTAMP NULL;
