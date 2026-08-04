-- Migration: add must_change_password flag to users
-- Existing users keep false (they already have their own password).
-- New users created by the admin will be inserted with true.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
