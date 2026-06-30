-- ── Migración 029 ──────────────────────────────────────────────────────────────
-- 1. Agrega comentario del usuario al completar una tarea
-- 2. Crea la tabla de notificaciones

-- 1. Columna user_comment en tasks
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS user_comment TEXT;

-- 2. Tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
  notification_id  SERIAL PRIMARY KEY,
  recipient_email  VARCHAR(150) NOT NULL,
  title            VARCHAR(255) NOT NULL,
  message          TEXT,
  task_id          INT REFERENCES public.tasks(task_id) ON DELETE CASCADE,
  is_read          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient
  ON public.notifications (recipient_email, is_read, created_at DESC);
