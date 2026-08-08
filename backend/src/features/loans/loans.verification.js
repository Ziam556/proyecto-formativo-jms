/**
 * Almacén persistente de códigos de verificación de préstamos.
 * Clave: email del usuario (lowercase). Valor: { code, expiresAt }.
 * Expiración: 10 minutos.
 *
 * Se persiste en un archivo JSON para que los códigos sobrevivan reinicios
 * del servidor durante el periodo de validez (ej. hot-reload en desarrollo).
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);

// Archivo de persistencia junto a este módulo (excluir de git con .gitignore)
const STORE_PATH = path.join(__dirname, ".verification-store.json");

const EXPIRY_MS = 10 * 60 * 1000; // 10 min

// ── Helpers de persistencia ───────────────────────────────────────────────────

function loadStore() {
    try {
        if (fs.existsSync(STORE_PATH)) {
            const raw = fs.readFileSync(STORE_PATH, "utf8");
            return new Map(Object.entries(JSON.parse(raw)));
        }
    } catch {
        // Si el archivo está corrupto se empieza con un store vacío
    }
    return new Map();
}

function persistStore(map) {
    try {
        fs.writeFileSync(
            STORE_PATH,
            JSON.stringify(Object.fromEntries(map)),
            "utf8"
        );
    } catch (err) {
        console.error("[verification] No se pudo persistir el store de códigos:", err.message);
    }
}

// Limpiar entradas expiradas del store (evita crecimiento infinito del archivo)
function purgeExpired(map) {
    const now = Date.now();
    for (const [key, entry] of map.entries()) {
        if (now > entry.expiresAt) map.delete(key);
    }
}

// ── Store inicial (cargado desde disco) ──────────────────────────────────────

const store = loadStore();
purgeExpired(store); // eliminar expirados del ciclo anterior

// ── API pública ───────────────────────────────────────────────────────────────

export function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

const MAX_ATTEMPTS = 6;

export function saveCode(email, code) {
    store.set(email.toLowerCase(), {
        code,
        expiresAt: Date.now() + EXPIRY_MS,
        attempts:  0,
    });
    persistStore(store);
}

export function validateCode(email, code) {
    const key   = email.toLowerCase();
    const entry = store.get(key);

    if (!entry) return { valid: false, reason: "No se ha enviado ningún código a este correo." };

    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        persistStore(store);
        return { valid: false, reason: "El código expiró. Solicita uno nuevo." };
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
        store.delete(key);
        persistStore(store);
        return { valid: false, reason: "Demasiados intentos fallidos. Solicita un nuevo código." };
    }

    if (entry.code !== String(code).trim()) {
        entry.attempts += 1;
        persistStore(store);
        const remaining = MAX_ATTEMPTS - entry.attempts;
        return {
            valid:  false,
            reason: remaining > 0
                ? `El código ingresado no es correcto. Te quedan ${remaining} intento(s).`
                : "Demasiados intentos fallidos. Solicita un nuevo código.",
        };
    }

    // Código válido y de un solo uso → eliminar
    store.delete(key);
    persistStore(store);
    return { valid: true };
}
