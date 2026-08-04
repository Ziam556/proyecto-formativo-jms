-- Migration: add loan_type column to public.loans
-- Values: 'interno' (within the institution) | 'externo' (outside the institution)

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS loan_type VARCHAR(20)
    NOT NULL
    DEFAULT 'interno'
    CHECK (loan_type IN ('interno', 'externo'));
