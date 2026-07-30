-- ── Migración 035 ──────────────────────────────────────────────────────────────
-- Corrige el bug de recuperación de contraseña: el código OTP llegaba al correo
-- pero al validarlo el sistema respondía "código inválido o expirado" incluso
-- recién recibido.
--
-- Causa: expires_at estaba definido como TIMESTAMP (sin zona horaria). El
-- backend calcula la expiración con new Date() en la hora local del servidor
-- Node, pero la validación compara "expires_at > NOW()" directamente en
-- PostgreSQL, cuyo NOW() suele correr en UTC. Si la máquina local no está en
-- UTC (p. ej. Colombia, UTC-5), la comparación queda desfasada esas horas y
-- el código aparece "expirado" casi al instante de generarse.
--
-- Solución: usar TIMESTAMPTZ, que almacena el instante real (con zona
-- horaria) en vez de una hora "de pared" ambigua, haciendo la comparación
-- con NOW() correcta sin importar la zona horaria del servidor.
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.password_reset_tokens
    ALTER COLUMN expires_at TYPE TIMESTAMPTZ;

ALTER TABLE public.password_reset_tokens
    ALTER COLUMN created_at TYPE TIMESTAMPTZ;
