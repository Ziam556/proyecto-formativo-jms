import { Router }            from "express";
import multer                from "multer";
import path                  from "path";
import fs                    from "fs";
import { fileURLToPath }     from "url";
import { quotationsController } from "./quotations.controller.js";
import { authenticateToken } from "../../middlewares/auth.middlewares.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Carpeta de destino ────────────────────────────────────────────────────────
const QUOTATIONS_DIR = path.join(__dirname, "../../../../uploads/quotations");
fs.mkdirSync(QUOTATIONS_DIR, { recursive: true });

// ── Multer exclusivo para cotizaciones (solo PDF, máx 20 MB) ──────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, QUOTATIONS_DIR),
    filename:    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

const uploadQuotation = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") return cb(null, true);
        cb(new Error("Solo se permiten archivos PDF."));
    },
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
const router = Router();
router.use(authenticateToken);

router.get("/",  quotationsController.getAll);
router.post("/", uploadQuotation.single("quotationFile"), quotationsController.add);
router.delete("/", quotationsController.remove);

export default router;
