-- Agrega user_id SERIAL PRIMARY KEY a la tabla users.
-- user_document_number sigue siendo el identificador lógico en el backend;
-- user_id es la clave técnica que usan las tablas relacionales user_groups y user_permissions.

ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id SERIAL;

-- Asignar PK solo si no existe ya
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'users'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE users ADD PRIMARY KEY (user_id);
    END IF;
END
$$;
