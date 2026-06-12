CREATE TABLE IF NOT EXISTS users (
  user_email VARCHAR(150),
  user_email_verification VARCHAR(150),
  user_email_institutional VARCHAR(150),
  user_phone VARCHAR(20),
  user_secondary_phone VARCHAR(20),
  user_document_type VARCHAR(20),
  user_document_number VARCHAR(50),
  user_type VARCHAR(50),
  user_address TEXT,
  user_password TEXT,
  start_date DATE,
  end_date DATE,
  user_group VARCHAR(50),
  user_image TEXT
);
