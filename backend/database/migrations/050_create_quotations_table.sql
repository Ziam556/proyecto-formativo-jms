-- Tabla de cotizaciones con metadatos: quién subió, cuándo, nombre original del archivo
-- ON DELETE CASCADE: si se elimina un material, sus cotizaciones se eliminan automáticamente

CREATE TABLE IF NOT EXISTS public.quotations (
    quotation_id              SERIAL PRIMARY KEY,
    -- Una de las dos FK estará en NULL, la otra con valor
    returnable_material_id    VARCHAR(50)
        REFERENCES public.returnable_material(returnable_material_id) ON DELETE CASCADE,
    consumable_material_id    VARCHAR(50)
        REFERENCES public.consumable_material(consumable_material_id) ON DELETE CASCADE,
    file_path                 TEXT NOT NULL,
    file_name                 TEXT NOT NULL,           -- nombre original del archivo
    uploaded_by_email         TEXT,                    -- correo del usuario que subió
    uploaded_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT one_material_type CHECK (
        (returnable_material_id IS NOT NULL AND consumable_material_id IS NULL) OR
        (returnable_material_id IS NULL     AND consumable_material_id IS NOT NULL)
    )
);

-- Migrar datos existentes de material_quotations (JSON array) → filas en la nueva tabla

-- Devolutivos
INSERT INTO public.quotations (returnable_material_id, file_path, file_name)
SELECT
    r.returnable_material_id,
    elem.value,
    reverse(split_part(reverse(elem.value), '/', 1))
FROM public.returnable_material r,
     json_array_elements_text(
         CASE
             WHEN r.material_quotations IS NOT NULL
              AND r.material_quotations NOT IN ('null', '[]')
             THEN r.material_quotations::json
             ELSE '[]'::json
         END
     ) AS elem(value)
WHERE r.material_quotations IS NOT NULL
  AND r.material_quotations NOT IN ('null', '[]');

-- Consumibles
INSERT INTO public.quotations (consumable_material_id, file_path, file_name)
SELECT
    c.consumable_material_id,
    elem.value,
    reverse(split_part(reverse(elem.value), '/', 1))
FROM public.consumable_material c,
     json_array_elements_text(
         CASE
             WHEN c.material_quotations IS NOT NULL
              AND c.material_quotations NOT IN ('null', '[]')
             THEN c.material_quotations::json
             ELSE '[]'::json
         END
     ) AS elem(value)
WHERE c.material_quotations IS NOT NULL
  AND c.material_quotations NOT IN ('null', '[]');

-- Eliminar columna antigua de ambas tablas
ALTER TABLE public.returnable_material DROP COLUMN IF EXISTS material_quotations;
ALTER TABLE public.consumable_material  DROP COLUMN IF EXISTS material_quotations;
