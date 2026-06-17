INSERT INTO permissions (permission_name, permission_codename) VALUES
    ('Crear Usuarios',                          'create_user'),
    ('Editar Usuarios',                         'edit_user'),
    ('Listar Usuarios',                         'list_user'),
    ('Habilitar / Deshabilitar Usuarios',       'toggle_user'),
    ('Reportes Usuarios',                       'report_user'),

    ('Crear Prestamo',                          'create_loan'),
    ('Visualizar Prestamo',                     'view_loan'),
    ('Editar Prestamo',                         'edit_loan'),
    ('Reportes Prestamo',                       'report_loan'),
    ('Listar Prestamos',                        'list_loan'),

    ('Crear Material Consumo',                  'create_consumable'),
    ('Visualizar Material Consumo',             'view_consumable'),
    ('Editar Material Consumo',                 'edit_consumable'),
    ('Habilitar / Deshabilitar Material Consumo', 'toggle_consumable'),
    ('Reportes Material Consumo',               'report_consumable'),
    ('Listar Material Consumo',                 'list_consumable'),
    ('Retornar Sobrante Material Consumo',      'return_consumable'),

    ('Crear Material Devolutivo',               'create_returnable'),
    ('Listar Material Devolutivo',              'list_returnable'),
    ('Visualizar Material Devolutivo',          'view_returnable'),
    ('Editar Material Devolutivo',              'edit_returnable'),
    ('Habilitar / Deshabilitar Material Devolutivo', 'toggle_returnable'),
    ('Reportes Material Devolutivo',            'report_returnable'),
    ('Regresar Material Devolutivo',            'return_returnable'),

    ('Crear Marca',                             'create_brand'),
    ('Listar Marcas',                           'list_brand'),
    ('Editar Marca',                            'edit_brand'),
    ('Habilitar / Deshabilitar Marca',          'toggle_brand'),
    ('Eliminar Marca',                          'delete_brand')
ON CONFLICT (permission_codename) DO NOTHING;
