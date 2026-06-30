-- Agrega las columnas "model" (modelo) y "serial" a consumable_material.

ALTER TABLE consumable_material
    ADD COLUMN IF NOT EXISTS material_model  VARCHAR(100),
    ADD COLUMN IF NOT EXISTS material_serial VARCHAR(100);