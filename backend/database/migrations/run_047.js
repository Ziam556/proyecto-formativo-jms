// Ejecutar: node database/migrations/run_047.js
// (desde la carpeta backend, con el servidor de BD activo)
import { pool } from "../../src/config/db.js";

const sql = `
  ALTER TABLE public.loan_items
    ADD COLUMN IF NOT EXISTS delivery_date DATE;
`;

pool.query(sql)
  .then(() => {
    console.log("✓ Migración 047 aplicada: columna delivery_date agregada a loan_items");
    pool.end();
  })
  .catch((err) => {
    console.error("✗ Error al aplicar migración:", err.message);
    pool.end();
    process.exit(1);
  });
