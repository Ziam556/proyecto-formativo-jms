-- Agrega la columna permission_module a la tabla permissions
-- para agrupar permisos por módulo en el frontend.

ALTER TABLE permissions
    ADD COLUMN IF NOT EXISTS permission_module VARCHAR(100) NOT NULL DEFAULT 'General';

-- Asignar módulo según el sufijo del codename
UPDATE permissions SET permission_module = CASE
    WHEN permission_codename LIKE '%_user'        THEN 'Módulo Usuarios'
    WHEN permission_codename LIKE '%_loan'        THEN 'Préstamo'
    WHEN permission_codename LIKE '%_consumable'  THEN 'Material Consumo'
    WHEN permission_codename LIKE '%_returnable'  THEN 'Material Devolutivo'
    WHEN permission_codename LIKE '%_brand'       THEN 'Marcas'
    ELSE 'General'
END;
