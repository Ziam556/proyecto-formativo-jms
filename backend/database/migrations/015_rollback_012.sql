-- Revierte la migración 012: elimina las columnas material_model y material_serial
-- de la tabla consumable_material.

ALTER TABLE consumable_material
  DROP COLUMN IF EXISTS material_model,
  DROP COLUMN IF EXISTS material_serial;
