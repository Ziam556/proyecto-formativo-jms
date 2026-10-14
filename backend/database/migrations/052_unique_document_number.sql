-- Elimina duplicados dejando solo el registro más antiguo (menor user_id),
-- luego agrega constraint UNIQUE para prevenir futuros duplicados.

-- 1. Borrar duplicados (conserva el user_id más bajo por número de documento)
DELETE FROM public.users
WHERE user_id NOT IN (
    SELECT MIN(user_id)
    FROM public.users
    GROUP BY user_document_number
);

-- 2. Agregar constraint UNIQUE
ALTER TABLE public.users
    ADD CONSTRAINT users_document_number_unique UNIQUE (user_document_number);
