-- ============================================================
-- Migración 028: Módulo de tareas
-- ============================================================

-- Tabla principal de tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  task_id             SERIAL PRIMARY KEY,
  task_name           VARCHAR(255) NOT NULL,
  task_description    TEXT,
  assigned_type       VARCHAR(10)  NOT NULL CHECK (assigned_type IN ('user', 'group')),
  assigned_user_doc   VARCHAR(50),                          -- doc del usuario asignado (si assigned_type = 'user')
  assigned_group_id   INT REFERENCES public.groups(group_id) ON DELETE SET NULL, -- grupo asignado (si assigned_type = 'group')
  priority            VARCHAR(10)  NOT NULL DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta')),
  due_date            DATE,
  status              VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                        CHECK (status IN ('pendiente', 'por_verificar', 'completada', 'rechazada')),
  admin_comment       TEXT,                                 -- comentario al aprobar o rechazar
  verified_by         VARCHAR(150),                         -- email del admin que verificó
  verified_at         TIMESTAMP,
  completed_at        TIMESTAMP,                            -- cuando el usuario marcó como hecha
  completed_by_doc    VARCHAR(50),                          -- doc del usuario que la marcó como hecha (útil en tareas de grupo)
  created_by          VARCHAR(150),                         -- email del admin que la creó
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- Tabla de evidencias adjuntas al completar una tarea
CREATE TABLE IF NOT EXISTS public.task_evidence (
  evidence_id   SERIAL PRIMARY KEY,
  task_id       INT          NOT NULL REFERENCES public.tasks(task_id) ON DELETE CASCADE,
  file_path     TEXT         NOT NULL,
  file_name     VARCHAR(255),
  file_type     VARCHAR(10)  CHECK (file_type IN ('image', 'file')),
  uploaded_at   TIMESTAMP DEFAULT NOW()
);
