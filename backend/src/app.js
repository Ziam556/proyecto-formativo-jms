import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import consumableMaterialRoutes from "./features/consumableMaterial/consumableMaterial.routes.js";
import returnableMaterialRoutes from "./features/returnableMaterial/returnableMaterial.routes.js";
import brandsRoutes from "./features/brands/brands.routes.js";
import groupsRoutes from "./features/groups/groups.routes.js";
import accessRoutes from "./features/access/access.routes.js";
import loansRoutes from "./features/loans/loans.routes.js";
import catalogsRoutes from "./features/catalogs/catalogs.routes.js";
import tasksRoutes from "./features/tasks/tasks.routes.js";
import notificationsRoutes from "./features/notifications/notifications.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// CORS: solo permite peticiones desde el frontend en desarrollo
app.use(cors({ origin: "http://localhost:5173" }));

// Parsear JSON (para rutas que no usan multer)
app.use(express.json());

// Archivos estáticos: imágenes subidas accesibles en /uploads/...
// Ej: http://localhost:4000/uploads/profiles/foto.jpg
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rutas de la API
app.use("/api/users", userRoutes);
app.use("/api/consumableMaterial", consumableMaterialRoutes);
app.use("/api/returnableMaterial", returnableMaterialRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/catalogs", catalogsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/notifications", notificationsRoutes);

// Manejador de errores global — siempre devuelve JSON
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

export default app;
