-- Migración 020: eliminar usuario juan@gmail.com (documento 1089602524)
DELETE FROM users
WHERE user_email = 'juan@gmail.com'
  AND user_document_number = '1089602524';
