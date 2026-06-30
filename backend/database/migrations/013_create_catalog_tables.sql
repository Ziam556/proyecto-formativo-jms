-- Catálogo de estados de material (consumible y devolutivo)
CREATE TABLE IF NOT EXISTS catalog_state (
  id    SERIAL       PRIMARY KEY,
  code  VARCHAR(20)  NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- Catálogo de tipos de documento de identidad
CREATE TABLE IF NOT EXISTS catalog_document_type (
  id    SERIAL       PRIMARY KEY,
  code  VARCHAR(20)  NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- Catálogo de tipos de usuario
CREATE TABLE IF NOT EXISTS catalog_user_type (
  id    SERIAL       PRIMARY KEY,
  code  VARCHAR(20)  NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- Catálogo de categorías de material devolutivo
CREATE TABLE IF NOT EXISTS catalog_category (
  id    SERIAL       PRIMARY KEY,
  code  VARCHAR(20)  NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);

-- Catálogo de tipos de material (devolutivo / consumo)
CREATE TABLE IF NOT EXISTS catalog_material_type (
  id    SERIAL       PRIMARY KEY,
  code  VARCHAR(20)  NOT NULL UNIQUE,
  label VARCHAR(100) NOT NULL
);
