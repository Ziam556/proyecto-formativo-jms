-- Agrega la columna user_name a la tabla users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS user_name VARCHAR(150);
