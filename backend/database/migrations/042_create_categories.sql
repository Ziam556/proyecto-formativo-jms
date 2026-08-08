-- ─────────────────────────────────────────────────────────────────────────
-- 042 – Tabla de categorías para materiales consumibles y devolutivos
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
    id      SERIAL       PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE,
    prefix  VARCHAR(10)  NOT NULL DEFAULT '',
    enabled BOOLEAN      NOT NULL DEFAULT true
);

-- 2. Datos iniciales
INSERT INTO public.categories (name, prefix) VALUES
    ('Herramientas',       'HER'),
    ('Muebles y Enseres',  'MUE'),
    ('Equipo y Maquinaria','EQU')
ON CONFLICT (name) DO NOTHING;

-- 3. Agregar columna de categoría (texto) a material consumible
--    (la tabla aún no tiene categoría; se guarda el nombre de la categoría)
ALTER TABLE public.consumable_material
    ADD COLUMN IF NOT EXISTS material_category VARCHAR(100);
