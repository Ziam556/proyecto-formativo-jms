-- ─────────────────────────────────────────────────────────────────────────
-- 055 – Agregar notification_email a la tabla loans
--
-- El correo del solicitante se usaba solo para enviar el código de
-- verificación pero no se persistía. Esta migración lo almacena para poder
-- mostrarlo en la lista de préstamos cuando el usuario no está registrado.
-- ─────────────────────────────────────────────────────────────────────────

ALTER TABLE public.loans
    ADD COLUMN IF NOT EXISTS notification_email VARCHAR(150);
