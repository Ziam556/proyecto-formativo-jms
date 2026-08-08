-- Agrega fecha de entrega individual por ítem de préstamo.
-- Permite que materiales devolutivos en un mismo préstamo tengan distintas fechas de devolución.
ALTER TABLE public.loan_items
  ADD COLUMN IF NOT EXISTS delivery_date DATE;
