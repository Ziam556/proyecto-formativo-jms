-- ============================================================
-- MIGRACIÓN 001 — Tablas de relación: Cuentadantes + Teléfonos
-- Ejecutar en pgAdmin → Query Tool sobre la BD del proyecto
-- ============================================================

-- ── 1. Tabla de cuentadantes para material de CONSUMO ────────
CREATE TABLE IF NOT EXISTS public.consumable_material_accountholders (
  consumable_material_id VARCHAR(50) NOT NULL,
  user_id                INTEGER     NOT NULL,
  PRIMARY KEY (consumable_material_id, user_id),
  CONSTRAINT fk_cma_material
    FOREIGN KEY (consumable_material_id)
    REFERENCES public.consumable_material(consumable_material_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_cma_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(user_id)
    ON DELETE CASCADE
);

-- ── 2. Tabla de cuentadantes para material DEVOLUTIVO ────────
CREATE TABLE IF NOT EXISTS public.returnable_material_accountholders (
  returnable_material_id VARCHAR(50) NOT NULL,
  user_id                INTEGER     NOT NULL,
  PRIMARY KEY (returnable_material_id, user_id),
  CONSTRAINT fk_rma_material
    FOREIGN KEY (returnable_material_id)
    REFERENCES public.returnable_material(returnable_material_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_rma_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(user_id)
    ON DELETE CASCADE
);

-- ── 3. Eliminar columna JSON legacy de ambas tablas ─────────
--    (los datos previos quedan sin migrar — reasignar desde el formulario)
ALTER TABLE public.consumable_material  DROP COLUMN IF EXISTS material_story_teller;
ALTER TABLE public.returnable_material  DROP COLUMN IF EXISTS material_story_teller;

-- ── 4. Tabla de teléfonos (varios por usuario, sin UNIQUE en phone_number) ──
CREATE TABLE IF NOT EXISTS public.user_phones (
  user_id      INTEGER     NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  is_primary   BOOLEAN     NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, phone_number),
  CONSTRAINT fk_up_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(user_id)
    ON DELETE CASCADE
);

-- ── 5. Migrar teléfonos existentes a la nueva tabla ─────────
INSERT INTO public.user_phones (user_id, phone_number, is_primary)
SELECT user_id, user_phone, true
FROM   public.users
WHERE  user_phone IS NOT NULL AND user_phone <> ''
ON CONFLICT DO NOTHING;

INSERT INTO public.user_phones (user_id, phone_number, is_primary)
SELECT user_id, user_secondary_phone, false
FROM   public.users
WHERE  user_secondary_phone IS NOT NULL AND user_secondary_phone <> ''
ON CONFLICT DO NOTHING;

-- ── 6. Eliminar columnas de teléfono directas de users ──────
ALTER TABLE public.users DROP COLUMN IF EXISTS user_phone;
ALTER TABLE public.users DROP COLUMN IF EXISTS user_secondary_phone;
