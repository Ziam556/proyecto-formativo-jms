-- Migration: add material_technical_sheet column to consumable_material
-- Run once against your PostgreSQL database

ALTER TABLE public.consumable_material
  ADD COLUMN IF NOT EXISTS material_technical_sheet TEXT;
