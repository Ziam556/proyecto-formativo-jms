-- Agrega columna de inventario a cotizaciones
ALTER TABLE public.quotations
    ADD COLUMN IF NOT EXISTS inventory_name TEXT;
