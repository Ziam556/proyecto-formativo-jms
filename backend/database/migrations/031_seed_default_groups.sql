-- ── Migración 031 ──────────────────────────────────────────────────────────────
-- Grupos predeterminados que reemplazan al antiguo "Tipo de usuario"
-- (Administrador, Instructor, Invitado). No se borra ni se modifica nada
-- existente; si algún grupo ya existe con ese nombre, se omite.

INSERT INTO public.groups (group_name) VALUES
  ('Administrador'),
  ('Instructor'),
  ('Invitado')
ON CONFLICT (group_name) DO NOTHING;
