import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Tipos permitidos por campo
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "image/png",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Crea las carpetas necesarias si no existen
const dirs = ["profiles", "consumable", "returnable", "tasks"];
dirs.forEach((d) => {
  fs.mkdirSync(path.join(__dirname, `../../uploads/${d}`), { recursive: true });
});

// Decide la subcarpeta según el campo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "userImage") {
      cb(null, path.join(__dirname, "../../uploads/profiles"));
    } else if (
      file.fieldname === "materialTechnicalSheet" ||
      file.fieldname === "materialQuotation"
    ) {
      const sub = req.baseUrl.includes("returnable") ? "returnable" : "consumable";
      cb(null, path.join(__dirname, `../../uploads/${sub}`));
    } else {
      // materialImage de cualquier feature
      const sub = req.baseUrl.includes("returnable") ? "returnable" : "consumable";
      cb(null, path.join(__dirname, `../../uploads/${sub}`));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// Valida tipos según el campo
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "materialTechnicalSheet") {
    if (DOCUMENT_TYPES.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("La ficha técnica debe ser PDF, PNG o Excel"), false);
  }
  if (file.fieldname === "materialQuotation") {
    if (file.mimetype === "application/pdf") return cb(null, true);
    return cb(new Error("Las cotizaciones deben ser archivos PDF"), false);
  }
  // Imágenes (userImage, materialImage)
  if (IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
  return cb(new Error("La imagen debe ser JPG, PNG o SVG"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB general; la ficha técnica se valida a 3 MB en el frontend
});

// ── Multer para evidencias de tareas (imágenes + cualquier archivo) ──
const taskEvidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/tasks"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadTaskEvidence = multer({
  storage: taskEvidenceStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB por archivo de evidencia
});
