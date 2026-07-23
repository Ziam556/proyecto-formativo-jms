// Script para crear las tablas en la base de datos
// Ejecutar con: node src/scripts/migrate.js

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const SQL = `
-- =============================================
-- Tabla principal de usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS public.app_user (
    user_id                   SERIAL PRIMARY KEY,
    user_email                VARCHAR(150) UNIQUE NOT NULL,
    user_email_verification   VARCHAR(150),
    user_email_institutional  VARCHAR(150),
    user_phone                VARCHAR(20),
    user_secondary_phone      VARCHAR(20),
    user_document_type        VARCHAR(20),
    user_document_number      VARCHAR(50),
    user_type                 VARCHAR(50),
    user_address              TEXT,
    user_password             TEXT NOT NULL,
    start_date                DATE,
    end_date                  DATE,
    user_group                VARCHAR(50),
    user_image                TEXT,
    is_active                 BOOLEAN DEFAULT TRUE,
    is_staff                  BOOLEAN DEFAULT FALSE,
    is_superuser              BOOLEAN DEFAULT FALSE,
    created_at                TIMESTAMP DEFAULT NOW(),
    updated_at                TIMESTAMP DEFAULT NOW(),
    last_login                TIMESTAMP
);

-- =============================================
-- Tabla de tipos de contenido (para permisos)
-- =============================================
CREATE TABLE IF NOT EXISTS public.content_type (
    content_type_id SERIAL PRIMARY KEY,
    app_label       VARCHAR(50) NOT NULL,
    model           VARCHAR(50) NOT NULL,
    UNIQUE (app_label, model)
);

-- =============================================
-- Tabla de permisos
-- =============================================
CREATE TABLE IF NOT EXISTS public.auth_permission (
    permission_id       SERIAL PRIMARY KEY,
    permission_name     VARCHAR(150) NOT NULL,
    permission_codename VARCHAR(100) UNIQUE NOT NULL,
    content_type_id     INT REFERENCES public.content_type(content_type_id) ON DELETE CASCADE,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Tabla de grupos
-- =============================================
CREATE TABLE IF NOT EXISTS public.auth_group (
    group_id   SERIAL PRIMARY KEY,
    name       VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Relación usuario <-> grupo
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_group (
    user_id    INT REFERENCES public.app_user(user_id)    ON DELETE CASCADE,
    group_id   INT REFERENCES public.auth_group(group_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, group_id)
);

-- =============================================
-- Relación grupo <-> permiso
-- =============================================
CREATE TABLE IF NOT EXISTS public.group_permission (
    group_id      INT REFERENCES public.auth_group(group_id)           ON DELETE CASCADE,
    permission_id INT REFERENCES public.auth_permission(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, permission_id)
);

-- =============================================
-- Relación usuario <-> permiso directo
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_permission (
    user_id       INT REFERENCES public.app_user(user_id)              ON DELETE CASCADE,
    permission_id INT REFERENCES public.auth_permission(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, permission_id)
);

-- =============================================
-- Tabla de tareas
-- =============================================
CREATE TABLE IF NOT EXISTS public.task (
    task_id     SERIAL PRIMARY KEY,
    task_name   VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    status      VARCHAR(50) CHECK (status IN ('pendiente','en_progreso','completada','cancelada')),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    user_id     INT NULL REFERENCES public.app_user(user_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_task_user_id ON public.task (user_id);

-- =============================================
-- Columnas de bloqueo de cuenta (intentos fallidos)
-- =============================================
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS login_attempts INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until   TIMESTAMP NULL;

-- =============================================
-- Columna de habilitado/deshabilitado
-- =============================================
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT TRUE;

-- =============================================
-- Tabla de tokens de recuperación de contraseña
-- =============================================
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id           SERIAL PRIMARY KEY,
    user_email   VARCHAR(150) NOT NULL,
    otp_code     VARCHAR(6)   NOT NULL,
    expires_at   TIMESTAMP    NOT NULL,
    used         BOOLEAN      DEFAULT FALSE,
    created_at   TIMESTAMP    DEFAULT NOW()
);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Conectando a la base de datos...");
    await client.query(SQL);
    console.log("✅ Tablas creadas correctamente en la base de datos.");
  } catch (err) {
    console.error("❌ Error al crear las tablas:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
