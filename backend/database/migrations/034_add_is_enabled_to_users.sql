-- Migración 034: agregar columna is_enabled a la tabla users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE users SET is_enabled = TRUE WHERE is_enabled IS NULL;
