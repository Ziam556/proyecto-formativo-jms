-- ─────────────────────────────────────────────────────────────────────────
-- 053 – Hacer obligatoria la fecha de compra en material devolutivo
--
-- La columna material_purchase_date fue definida originalmente como DATE
-- nullable. Ahora que el formulario la exige, se refuerza la restricción
-- también a nivel de base de datos para garantizar integridad desde la fuente.
--
-- Si existen filas con purchase_date = NULL (registradas antes de este cambio)
-- se les asigna la fecha de ingreso como valor por defecto; si tampoco tienen
-- fecha de ingreso se usa la fecha actual.
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Rellenar NULLs existentes antes de aplicar la restricción
UPDATE public.returnable_material
SET    material_purchase_date = COALESCE(material_entry_date, CURRENT_DATE)
WHERE  material_purchase_date IS NULL;

-- 2. Agregar la restricción NOT NULL
ALTER TABLE public.returnable_material
    ALTER COLUMN material_purchase_date SET NOT NULL;
