-- Tabla relacional usuario ↔ permiso (permisos directos).
-- Permite asignar permisos individuales a un usuario
-- independientemente del grupo al que pertenezca.
-- Los permisos efectivos = permisos del grupo + permisos directos.

CREATE TABLE IF NOT EXISTS user_permissions (
    user_id       INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, permission_id),

    CONSTRAINT fk_user_permissions_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(permission_id)
        ON DELETE CASCADE
);
