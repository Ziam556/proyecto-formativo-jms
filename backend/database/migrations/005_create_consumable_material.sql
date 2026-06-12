CREATE TABLE IF NOT EXISTS consumable_material (
    consumable_material_id  VARCHAR(50) PRIMARY KEY,
    material_plate          VARCHAR(50),
    material_element_name   VARCHAR(150) NOT NULL,
    material_brand          VARCHAR(100),
    material_image          TEXT,
    material_story_teller   VARCHAR(150),
    material_amount         INTEGER,
    material_unit_value     DECIMAL(12,2),
    material_total_value    DECIMAL(12,2),
    material_state          VARCHAR(50),
    material_description    TEXT,
    material_purchase_date  DATE,
    material_location       VARCHAR(150)
);