/**
 * Runner de migraciones automático.
 * Lee todos los archivos .sql de esta carpeta en orden numérico,
 * lleva un registro en la tabla "migrations" y solo aplica los nuevos.
 *
 * Se ejecuta automáticamente al arrancar el servidor (importado desde server.js).
 */

import fs        from "fs";
import path      from "path";
import { fileURLToPath } from "url";
import { pool }  from "../src/config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
    // 1. Crear tabla de control si no existe
    await pool.query(`
        CREATE TABLE IF NOT EXISTS public.migrations (
            id         SERIAL PRIMARY KEY,
            filename   VARCHAR(255) UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    // 2. Leer archivos .sql ordenados
    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();

    // 3. Obtener migraciones ya aplicadas
    const { rows } = await pool.query("SELECT filename FROM public.migrations");
    const applied = new Set(rows.map((r) => r.filename));

    // 4. Aplicar las pendientes
    let count = 0;
    for (const file of files) {
        if (applied.has(file)) continue;

        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        try {
            await pool.query(sql);
            await pool.query(
                "INSERT INTO public.migrations (filename) VALUES ($1)",
                [file]
            );
            console.log(`✓ Migración aplicada: ${file}`);
            count++;
        } catch (err) {
            console.error(`✗ Error en migración ${file}: ${err.message}`);
            // No detiene el servidor — registra el error y continúa
        }
    }

    if (count === 0) {
        console.log("✓ Migraciones: todo al día, nada nuevo que aplicar.");
    } else {
        console.log(`✓ Migraciones: ${count} nueva(s) aplicada(s).`);
    }
}
