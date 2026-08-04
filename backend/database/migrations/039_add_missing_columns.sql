-- Migration: add missing columns to loans and loan_items
-- Run once against your PostgreSQL database

-- 1. Tipo de préstamo en loans
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS loan_type VARCHAR(20)
    NOT NULL DEFAULT 'interno'
    CHECK (loan_type IN ('interno', 'externo'));

-- 2. Referencias de inventario en loan_items
ALTER TABLE public.loan_items
  ADD COLUMN IF NOT EXISTS returnable_material_id VARCHAR(50)
    REFERENCES public.returnable_material(returnable_material_id)
    ON DELETE SET NULL;

ALTER TABLE public.loan_items
  ADD COLUMN IF NOT EXISTS consumable_material_id VARCHAR(50)
    REFERENCES public.consumable_material(consumable_material_id)
    ON DELETE SET NULL;
