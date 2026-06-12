-- ===========================================
-- ESQUEMA COMPLETO PARA GESTIÓN DE USUARIOS,
-- ROLES, PERMISOS Y TAREAS EN POSTGRESQL
-- Archivo: users.esquema.sql
-- ===========================================


-- ===========================================
-- 1) Tabla: app_user
-- ===========================================
CREATE TABLE public.app_user (
    user_id          SERIAL PRIMARY KEY,
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


-- ===========================================
-- 2) Tabla: content_type
-- ===========================================
CREATE TABLE public.content_type (
    content_type_id SERIAL PRIMARY KEY,
    app_label       VARCHAR(50) NOT NULL,
    model           VARCHAR(50) NOT NULL,
    UNIQUE (app_label, model)
);


-- ===========================================
-- 3) Tabla: auth_permission (FK a content_type)
-- ===========================================
CREATE TABLE public.auth_permission (
    permission_id       SERIAL PRIMARY KEY,
    permission_name     VARCHAR(150) NOT NULL,
    permission_codename VARCHAR(100) UNIQUE NOT NULL,
    content_type_id     INT REFERENCES public.content_type(content_type_id) ON DELETE CASCADE,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auth_permission_content_type_id
    ON public.auth_permission (content_type_id);


-- ===========================================
-- 4) Tabla: auth_group
-- ===========================================
CREATE TABLE public.auth_group (
    group_id   SERIAL PRIMARY KEY,
    name       VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- ===========================================
-- 5) Relación M:N → user_group
-- ===========================================
CREATE TABLE public.user_group (
    user_id    INT REFERENCES public.app_user(user_id)   ON DELETE CASCADE,
    group_id   INT REFERENCES public.auth_group(group_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, group_id)
);


-- ===========================================
-- 6) Relación M:N → group_permission
-- ===========================================
CREATE TABLE public.group_permission (
    group_id      INT REFERENCES public.auth_group(group_id)       ON DELETE CASCADE,
    permission_id INT REFERENCES public.auth_permission(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, permission_id)
);


-- ===========================================
-- 7) Relación M:N → user_permission
-- ===========================================
CREATE TABLE public.user_permission (
    user_id       INT REFERENCES public.app_user(user_id)           ON DELETE CASCADE,
    permission_id INT REFERENCES public.auth_permission(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, permission_id)
);


-- ===========================================
-- 8) Tabla: task (FK a app_user, nullable)
-- ===========================================
CREATE TABLE public.task (
    task_id     SERIAL PRIMARY KEY,
    task_name   VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    status      VARCHAR(50) CHECK (status IN ('pendiente','en_progreso','completada','cancelada')),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    user_id     INT NULL REFERENCES public.app_user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_task_user_id ON public.task (user_id);