-- Agrega la columna "enabled" a consumable_material para poder

ALTER TABLE consumable_material
    ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;