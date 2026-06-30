-- Seed: estados de material
INSERT INTO catalog_state (code, label) VALUES
  ('N.D', 'No Disponible'),
  ('D',   'Disponible'),
  ('P',   'Prestamo'),
  ('T',   'Traslado'),
  ('M',   'Mantenimiento'),
  ('B',   'Baja')
ON CONFLICT (code) DO NOTHING;

-- Seed: tipos de documento
INSERT INTO catalog_document_type (code, label) VALUES
  ('C.C',   'Cedula de ciudadania'),
  ('T.I',   'Tarjeta de identidad'),
  ('P.P.T', 'Permiso por Proteccion Temporal'),
  ('P.E.P', 'Permiso Especial de Permanencia'),
  ('C.E',   'Cedula de Extranjeria')
ON CONFLICT (code) DO NOTHING;

-- Seed: tipos de usuario
INSERT INTO catalog_user_type (code, label) VALUES
  ('Admin', 'Administrador'),
  ('Inst',  'Instructor'),
  ('Inv',   'Invitado')
ON CONFLICT (code) DO NOTHING;

-- Seed: categorías de material devolutivo
INSERT INTO catalog_category (code, label) VALUES
  ('H',     'Herramienta'),
  ('M.Y.E', 'Mueble y enseres'),
  ('M.E',   'Maquinaria y equipo')
ON CONFLICT (code) DO NOTHING;

-- Seed: tipos de material
INSERT INTO catalog_material_type (code, label) VALUES
  ('M.D', 'Material Devolutivo'),
  ('M.C', 'Material de Consumo')
ON CONFLICT (code) DO NOTHING;
