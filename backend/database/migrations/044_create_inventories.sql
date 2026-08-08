-- ============================================================
-- MIGRACIÓN 044 — Tabla de nombres de inventario
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventories (
    id      SERIAL        PRIMARY KEY,
    name    VARCHAR(150)  NOT NULL UNIQUE,
    enabled BOOLEAN       NOT NULL DEFAULT true
);

-- Agregar columna a material de consumo
ALTER TABLE public.consumable_material
    ADD COLUMN IF NOT EXISTS material_inventory VARCHAR(150);

-- Agregar columna a material devolutivo
ALTER TABLE public.returnable_material
    ADD COLUMN IF NOT EXISTS material_inventory VARCHAR(150);
