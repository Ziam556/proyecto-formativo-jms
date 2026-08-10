-- Migración 051: permisos faltantes para módulos nuevos
-- Módulos: Categorías, Inventarios, Tareas, Cotizaciones, Grupos

INSERT INTO permissions (permission_name, permission_codename, permission_module) VALUES

  -- ── Categorías ─────────────────────────────────────────────────
  ('Crear Categoría',                        'create_category',   'Categorías'),
  ('Listar Categorías',                      'list_category',     'Categorías'),
  ('Editar Categoría',                       'edit_category',     'Categorías'),
  ('Habilitar / Deshabilitar Categoría',     'toggle_category',   'Categorías'),
  ('Eliminar Categoría',                     'delete_category',   'Categorías'),

  -- ── Inventarios ────────────────────────────────────────────────
  ('Crear Inventario',                       'create_inventory',  'Inventarios'),
  ('Listar Inventarios',                     'list_inventory',    'Inventarios'),
  ('Editar Inventario',                      'edit_inventory',    'Inventarios'),
  ('Habilitar / Deshabilitar Inventario',    'toggle_inventory',  'Inventarios'),
  ('Eliminar Inventario',                    'delete_inventory',  'Inventarios'),

  -- ── Tareas ─────────────────────────────────────────────────────
  ('Crear Tarea',                            'create_task',       'Tareas'),
  ('Listar Tareas',                          'list_task',         'Tareas'),
  ('Visualizar Tarea',                       'view_task',         'Tareas'),
  ('Completar Tarea',                        'complete_task',     'Tareas'),
  ('Verificar Tarea',                        'verify_task',       'Tareas'),
  ('Eliminar Tarea',                         'delete_task',       'Tareas'),

  -- ── Cotizaciones ───────────────────────────────────────────────
  ('Subir Cotización',                       'create_quotation',  'Cotizaciones'),
  ('Listar Cotizaciones',                    'list_quotation',    'Cotizaciones'),
  ('Eliminar Cotización',                    'delete_quotation',  'Cotizaciones'),

  -- ── Grupos ─────────────────────────────────────────────────────
  ('Crear Grupo',                            'create_group',      'Grupos'),
  ('Listar Grupos',                          'list_group',        'Grupos'),
  ('Editar Grupo',                           'edit_group',        'Grupos'),
  ('Habilitar / Deshabilitar Grupo',         'toggle_group',      'Grupos'),
  ('Eliminar Grupo',                         'delete_group',      'Grupos'),
  ('Agregar Usuarios a Grupo',               'add_users_group',   'Grupos')

ON CONFLICT (permission_codename) DO NOTHING;
