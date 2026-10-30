-- ─────────────────────────────────────────────────────────────────────────
-- 054 – Aplicar NOT NULL a todos los campos obligatorios del sistema
--
-- Auditoría completa de campos requeridos en los formularios del frontend
-- que aún eran nullable en la base de datos.
-- Se rellenan los NULL existentes con valores por defecto seguros antes de
-- aplicar cada restricción, para no romper registros legacy.
-- ─────────────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════════════
-- 1. TABLA users
--    La tabla fue creada en 001 con todas las columnas nullable. Solo
--    enabled (021) e is_enabled (034, luego eliminado en 046) se crearon
--    con NOT NULL. El resto quedó desprotegido.
-- ══════════════════════════════════════════════════════════════════════════

-- user_name (obligatorio en el formulario de registro)
UPDATE public.users SET user_name = 'Sin nombre' WHERE user_name IS NULL OR user_name = '';
ALTER TABLE public.users ALTER COLUMN user_name SET NOT NULL;

-- user_email (obligatorio en el formulario de registro)
-- Usa el user_id para garantizar unicidad si hay varios NULL
UPDATE public.users
SET user_email = CONCAT('usuario', user_id, '@sena.edu.co')
WHERE user_email IS NULL OR user_email = '';
ALTER TABLE public.users ALTER COLUMN user_email SET NOT NULL;

-- user_document_type (obligatorio)
UPDATE public.users SET user_document_type = 'CC' WHERE user_document_type IS NULL OR user_document_type = '';
ALTER TABLE public.users ALTER COLUMN user_document_type SET NOT NULL;

-- user_document_number (obligatorio; tiene UNIQUE → relleno con user_id para evitar conflicto)
UPDATE public.users
SET user_document_number = CONCAT('DOC', user_id)
WHERE user_document_number IS NULL OR user_document_number = '';
ALTER TABLE public.users ALTER COLUMN user_document_number SET NOT NULL;

-- user_address (obligatorio)
UPDATE public.users SET user_address = 'Sin dirección' WHERE user_address IS NULL OR user_address = '';
ALTER TABLE public.users ALTER COLUMN user_address SET NOT NULL;

-- user_password (obligatorio)
UPDATE public.users SET user_password = '$2b$10$placeholder.hash.for.legacy.row' WHERE user_password IS NULL OR user_password = '';
ALTER TABLE public.users ALTER COLUMN user_password SET NOT NULL;

-- start_date (obligatorio; se usa la fecha actual como fallback)
UPDATE public.users SET start_date = CURRENT_DATE WHERE start_date IS NULL;
ALTER TABLE public.users ALTER COLUMN start_date SET NOT NULL;

-- end_date (obligatorio)
UPDATE public.users SET end_date = CURRENT_DATE + INTERVAL '1 year' WHERE end_date IS NULL;
ALTER TABLE public.users ALTER COLUMN end_date SET NOT NULL;


-- ══════════════════════════════════════════════════════════════════════════
-- 2. TABLA consumable_material
-- ══════════════════════════════════════════════════════════════════════════

-- material_amount (obligatorio — cantidad del material)
UPDATE public.consumable_material SET material_amount = 0 WHERE material_amount IS NULL;
ALTER TABLE public.consumable_material ALTER COLUMN material_amount SET NOT NULL;

-- material_unit_value (obligatorio — valor unitario)
UPDATE public.consumable_material SET material_unit_value = 0 WHERE material_unit_value IS NULL;
ALTER TABLE public.consumable_material ALTER COLUMN material_unit_value SET NOT NULL;

-- material_total_value (calculado automáticamente — siempre presente)
UPDATE public.consumable_material
SET material_total_value = material_amount * material_unit_value
WHERE material_total_value IS NULL;
ALTER TABLE public.consumable_material ALTER COLUMN material_total_value SET NOT NULL;

-- material_state (obligatorio)
UPDATE public.consumable_material SET material_state = 'Disponible' WHERE material_state IS NULL OR material_state = '';
ALTER TABLE public.consumable_material ALTER COLUMN material_state SET NOT NULL;

-- material_purchase_date (obligatorio)
UPDATE public.consumable_material
SET material_purchase_date = COALESCE(material_entry_date, CURRENT_DATE)
WHERE material_purchase_date IS NULL;
ALTER TABLE public.consumable_material ALTER COLUMN material_purchase_date SET NOT NULL;

-- material_entry_date (obligatorio)
UPDATE public.consumable_material SET material_entry_date = CURRENT_DATE WHERE material_entry_date IS NULL;
ALTER TABLE public.consumable_material ALTER COLUMN material_entry_date SET NOT NULL;

-- material_location (obligatorio)
UPDATE public.consumable_material SET material_location = 'Sin ubicación' WHERE material_location IS NULL OR material_location = '';
ALTER TABLE public.consumable_material ALTER COLUMN material_location SET NOT NULL;

-- material_technical_sheet (obligatorio — ficha técnica en PDF)
UPDATE public.consumable_material SET material_technical_sheet = 'sin-ficha.pdf' WHERE material_technical_sheet IS NULL OR material_technical_sheet = '';
ALTER TABLE public.consumable_material ALTER COLUMN material_technical_sheet SET NOT NULL;


-- ══════════════════════════════════════════════════════════════════════════
-- 3. TABLA returnable_material
--    (material_purchase_date ya fue cubierta en migración 053)
-- ══════════════════════════════════════════════════════════════════════════

-- material_plate (obligatorio — placa SENA)
UPDATE public.returnable_material
SET material_plate = returnable_material_id
WHERE material_plate IS NULL OR material_plate = '';
ALTER TABLE public.returnable_material ALTER COLUMN material_plate SET NOT NULL;

-- material_state (obligatorio)
UPDATE public.returnable_material SET material_state = 'Disponible' WHERE material_state IS NULL OR material_state = '';
ALTER TABLE public.returnable_material ALTER COLUMN material_state SET NOT NULL;

-- material_entry_date (obligatorio)
UPDATE public.returnable_material
SET material_entry_date = COALESCE(material_purchase_date, CURRENT_DATE)
WHERE material_entry_date IS NULL;
ALTER TABLE public.returnable_material ALTER COLUMN material_entry_date SET NOT NULL;

-- material_technical_sheet (obligatorio — ficha técnica en PDF)
UPDATE public.returnable_material SET material_technical_sheet = 'sin-ficha.pdf' WHERE material_technical_sheet IS NULL OR material_technical_sheet = '';
ALTER TABLE public.returnable_material ALTER COLUMN material_technical_sheet SET NOT NULL;


-- ══════════════════════════════════════════════════════════════════════════
-- 4. TABLA loans
-- ══════════════════════════════════════════════════════════════════════════

-- departure_date (se auto-asigna a la fecha de hoy al crear el préstamo)
UPDATE public.loans SET departure_date = CURRENT_DATE WHERE departure_date IS NULL;
ALTER TABLE public.loans ALTER COLUMN departure_date SET NOT NULL;

-- justification (obligatorio en el formulario paso 2)
UPDATE public.loans SET justification = 'Sin justificación' WHERE justification IS NULL OR justification = '';
ALTER TABLE public.loans ALTER COLUMN justification SET NOT NULL;
