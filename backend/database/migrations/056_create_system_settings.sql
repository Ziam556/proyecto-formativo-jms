-- ─────────────────────────────────────────────────────────────────────────────
-- 056 – Crear tabla system_settings
--
-- Tabla genérica clave-valor para configuraciones globales del sistema.
-- Solo el SuperAdministrador puede modificar estos valores.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.system_settings (
    key   VARCHAR(100) PRIMARY KEY,
    value TEXT         NOT NULL
);

-- Semilla: correo de contacto/soporte por defecto
INSERT INTO public.system_settings (key, value)
VALUES ('contact_email', 'sc876858@gmail.com')
ON CONFLICT (key) DO NOTHING;
