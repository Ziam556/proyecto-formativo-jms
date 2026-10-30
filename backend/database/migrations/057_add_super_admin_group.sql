-- ─────────────────────────────────────────────────────────────────────────────
-- 057 – Agregar grupo SuperAdministrador
--
-- Este grupo tiene acceso exclusivo a la configuración del sistema,
-- como editar el correo de contacto/soporte.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.groups (group_name)
VALUES ('SuperAdministrador')
ON CONFLICT (group_name) DO NOTHING;
